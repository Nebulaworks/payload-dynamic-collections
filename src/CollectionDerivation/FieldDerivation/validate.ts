import type { Hidden, HookWithProps, RawDynamicFieldDef, SupportedField } from '../../types'
import { fieldProps } from './constants'

/**
 * Validates that a function exists in a given object
 */
const validateFunction = (
  fnName: string,
  fnObject: Record<string, Hidden | Function | HookWithProps<unknown>>,
): boolean => fnName in fnObject

/**
 * Sanitizes a field definition by removing any extraneous properties
 * @param def - The field definition to be sanitized
 * @returns The sanitized field definition
 */
const sanitizeFieldDef = (def: SupportedField): SupportedField => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const sanitizedField = { name: def.name, type: def.type } as SupportedField

  // Only include valid properties for the field type
  const validKeys = Object.keys(def).filter(key => fieldProps[def.type].includes(key))

  // loop through the valid keys and add them to the sanitized field
  validKeys.forEach(key => {
    ;(sanitizedField as Record<string, unknown>)[key] = (def as Record<string, unknown>)[key]
  })

  // If the field is an array or group, sanitize its fields
  if ('fields' in sanitizedField) {
    const fields = sanitizedField.fields as SupportedField[]
    sanitizedField.fields = fields.map(sanitizeFieldDef)
  }

  return sanitizedField
}

/**
 * Validates a field definition
 * @param field - The field definition to be validated
 * @returns true if the field definition is valid, or an error message if it is not
 */
const validateFieldDef = (field: RawDynamicFieldDef): boolean | string => {
  // Ensure the field definition includes a type and name
  if (
    !('type' in field && typeof field.type === 'string') ||
    !('name' in field && typeof field.type === 'string')
  ) {
    return 'Field definition must include string values for "type" and "name"'
  }

  // Ensure the field type is valid
  if (!Object.keys(fieldProps).includes(field.type)) {
    return `Invalid field type; must be one of ${Object.keys(fieldProps).join(', ')}`
  }

  // Ensure the field definition includes required properties for the chosen field type
  switch (field.type) {
    case 'array': {
      if (!('fields' in field && Array.isArray(field.fields))) {
        return "Array field type requires parameter 'fields'"
      }
      return field.fields.reduce((acc, cur) => {
        if (acc !== true) {
          return acc
        }
        return validateFieldDef(cur)
      }, true)
    }
    case 'group': {
      if (!('fields' in field && Array.isArray(field.fields))) {
        return "Group field type requires parameter 'fields'"
      }
      return field.fields.reduce((acc, cur) => {
        if (acc !== true) {
          return acc
        }
        return validateFieldDef(cur)
      }, true)
    }
    case 'relationship': {
      if (!('relationTo' in field)) {
        return "Relationship field type requires parameter 'relationTo'"
      }
      return true
    }
    case 'select': {
      if (!('options' in field)) {
        return "Select field type requires parameter 'options'"
      }
      return true
    }
    default: {
      return true
    }
  }
}

export { validateFieldDef, sanitizeFieldDef, validateFunction }
