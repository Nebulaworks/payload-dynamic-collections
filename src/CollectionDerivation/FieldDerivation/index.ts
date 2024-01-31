import type { Field } from 'payload/types'
import type { CollectionFieldEntries, DynamicCollectionOptions, SupportedField } from '../../types'
import { sanitizeFieldDef, validateFieldDef } from './validate'
import { fieldAccess } from '../../utils/access'
import { ResolveFunction } from '../utils/resolveFunction'

/**
 * Derives a field configuration from a dynamic field
 * @param dynamicField The dynamic field to derive from
 * @param pluginOptions The plugin options passed by the user
 * @returns The derived field configuration, or an error message
 */
const DeriveField = (
  dynamicField: CollectionFieldEntries[0],
  pluginOptions: DynamicCollectionOptions,
): Field | string => {
  const { fieldAccessFunctions = {}, fieldHooks = {} } = pluginOptions
  const { beforeValidate = {}, beforeChange = {}, afterChange = {}, afterRead = {} } = fieldHooks
  const { def, access, hooks } = dynamicField
  const defValid = validateFieldDef(def)

  // If the field definition is invalid, return an error message
  if (typeof defValid === 'string') {
    return defValid
  }

  const accessFunctions = { ...fieldAccess, ...fieldAccessFunctions }

  try {
    // Sanitize the field definition
    const field: Field = sanitizeFieldDef(def as SupportedField)
    // Resolve the access and hooks functions
    const resolvedAccess =
      access !== undefined
        ? {
            ...ResolveFunction('create', accessFunctions, access.create ?? ''),
            ...ResolveFunction('read', accessFunctions, access.read ?? ''),
            ...ResolveFunction('update', accessFunctions, access.update ?? ''),
          }
        : {}
    const resolvedHooks =
      hooks !== undefined
        ? {
            ...ResolveFunction('beforeValidate', beforeValidate, hooks.beforeValidate ?? ''),
            ...ResolveFunction('beforeChange', beforeChange, hooks.beforeChange ?? ''),
            ...ResolveFunction('afterChange', afterChange, hooks.afterChange ?? ''),
            ...ResolveFunction('afterRead', afterRead, hooks.afterRead ?? ''),
          }
        : {}

    // Return the derived field configuration
    return {
      ...field,
      access: resolvedAccess,
      hooks: resolvedHooks,
    }
  } catch (e: unknown) {
    return e as string
  }
}

export default DeriveField
