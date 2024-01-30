import type { CollectionConfig, Field } from 'payload/types'
import type { DynamicCollection, DynamicCollectionOptions } from '../types'
import DeriveField from './FieldDerivation'
import { ResolveFunction } from './utils/resolveFunction'
import { collectionAccess } from '../utils/access'
import hidden from '../utils/hidden'

const DeriveCollection = (
  dynamicCollection: DynamicCollection,
  pluginOptions: DynamicCollectionOptions,
): CollectionConfig | string => {
  const {
    collectionAccessFunctions = {},
    collectionHooks = {},
    hiddenFunctions: userHiddenFunctions = {},
  } = pluginOptions
  const accessFunctions = { ...collectionAccess, ...collectionAccessFunctions }
  const hiddenFunctions = { ...hidden, ...userHiddenFunctions }
  const {
    beforeOperation = {},
    beforeValidate = {},
    beforeChange = {},
    afterChange = {},
    beforeRead = {},
    afterRead = {},
    beforeDelete = {},
    afterDelete = {},
    afterOperation = {},
  } = collectionHooks
  const {
    slug,
    fields,
    labels,
    graphQL,
    group,
    useAsTitle,
    hidden: selectedHidden,
    access,
    hooks,
  } = dynamicCollection

  const hookProps = hooks?.hookProps

  const derivedFields: Array<Field | string> = fields.map(field =>
    DeriveField(field, pluginOptions),
  )

  const [sanitizedFields, fieldErrors] = derivedFields.reduce(
    ([fds, errs], cur) => {
      if (typeof cur === 'string') {
        return [fds, [...errs, cur]]
      }

      return [[...fds, cur], errs]
    },
    [[] as Field[], [] as string[]],
  )

  if (fieldErrors.length > 0) {
    return `Error deriving fields: ${fieldErrors.join(', ')}`
  }

  const sanitizedLabels =
    labels && Object.keys(labels).length > 0
      ? {
          singular: labels?.singular || undefined,
          plural: labels?.plural || undefined,
        }
      : undefined

  const sanitizedGraphQL = graphQL?.allow
    ? {
        singularName: graphQL.singularName ? graphQL.singularName : undefined,
        pluralName: graphQL.pluralName ? graphQL.pluralName : undefined,
      }
    : false

  const sanitizedAccess = {
    ...ResolveFunction('create', accessFunctions, access?.create ?? ''),
    ...ResolveFunction('read', accessFunctions, access?.read ?? ''),
    ...ResolveFunction('update', accessFunctions, access?.update ?? ''),
    ...ResolveFunction('delete', accessFunctions, access?.delete ?? ''),
  }

  const sanitizedHooks = {
    ...ResolveFunction(
      'beforeOperation',
      beforeOperation,
      hooks?.beforeOperation ?? '',
      hookProps?.beforeOperation,
    ),
    ...ResolveFunction(
      'beforeValidate',
      beforeValidate,
      hooks?.beforeValidate ?? '',
      hookProps?.beforeValidate,
    ),
    ...ResolveFunction(
      'beforeChange',
      beforeChange,
      hooks?.beforeChange ?? '',
      hookProps?.beforeChange,
    ),
    ...ResolveFunction(
      'afterChange',
      afterChange,
      hooks?.afterChange ?? '',
      hookProps?.afterChange,
    ),
    ...ResolveFunction('beforeRead', beforeRead, hooks?.beforeRead ?? '', hookProps?.beforeRead),
    ...ResolveFunction('afterRead', afterRead, hooks?.afterRead ?? '', hookProps?.afterRead),
    ...ResolveFunction(
      'beforeDelete',
      beforeDelete,
      hooks?.beforeDelete ?? '',
      hookProps?.beforeDelete,
    ),
    ...ResolveFunction(
      'afterDelete',
      afterDelete,
      hooks?.afterDelete ?? '',
      hookProps?.afterDelete,
    ),
    ...ResolveFunction(
      'afterOperation',
      afterOperation,
      hooks?.afterOperation ?? '',
      hookProps?.afterOperation,
    ),
  }

  const derived: CollectionConfig = {
    slug,
    fields: sanitizedFields,
    labels: sanitizedLabels,
    graphQL: sanitizedGraphQL,
    admin: {
      useAsTitle: useAsTitle || 'id',
      group: group || undefined,
      ...ResolveFunction('hidden', hiddenFunctions, selectedHidden ?? ''),
    },
    access: sanitizedAccess,
    hooks: sanitizedHooks,
  }

  return derived
}

export default DeriveCollection
