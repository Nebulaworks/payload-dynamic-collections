import type { Hidden, HookWithProps, RawDynamicFieldDef, SupportedField } from '../../types'
import { fieldProps } from './constants'

const validateFunction = (
  fnName: string,
  fnObject: Record<string, Hidden | Function | HookWithProps<unknown>>,
): boolean => fnName in fnObject

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeFieldDef = (def: SupportedField): SupportedField => {
  // The eslint disable for the next line is due to a typing error when using
  // the suggested format of x: T = { ... }
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const sanitizedField = { name: def.name, type: def.type } as SupportedField

  const validKeys = Object.keys(def).filter(key => fieldProps[def.type].includes(key))

  validKeys.forEach(key => {
    ;(sanitizedField as Record<string, unknown>)[key] = (def as Record<string, unknown>)[key]
  })

  if ('fields' in sanitizedField) {
    const fields = sanitizedField.fields as SupportedField[]
    sanitizedField.fields = fields.map(sanitizeFieldDef)
  }

  return sanitizedField
}

const validateFieldDef = (field: RawDynamicFieldDef): boolean | string => {
  if (
    !('type' in field && typeof field.type === 'string') ||
    !('name' in field && typeof field.type === 'string')
  ) {
    return 'Field definition must include string values for "type" and "name"'
  }

  if (!Object.keys(fieldProps).includes(field.type)) {
    return `Invalid field type; must be one of ${Object.keys(fieldProps).join(', ')}`
  }

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
