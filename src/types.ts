import type {
  Access,
  ArrayField,
  BlockField,
  CollapsibleField,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeOperationHook,
  CollectionBeforeReadHook,
  CollectionBeforeValidateHook,
  Field,
  FieldAccess,
  FieldHook,
  GroupField,
  RadioField,
  RichTextField,
  RowField,
  TabsField,
  UIField,
  UploadField,
} from 'payload/types'

export interface HookWithProps<Hook> {
  /**
   * The `generator` function that takes properties of any given shape and returns a hook.
   * The props are passed to the generator function on rebuild and are set in the admin console
   * entry for the relevant dynamic collection
   */
  generator: (props: unknown) => Hook
  /**
   * The default properties that populate the corresponding prop input in the admin console.
   * Must be in the shape expected by the generator function
   */
  propsStructure: ArrayField | GroupField
}

export interface DynamicCollectionOptions {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean

  /**
   * Where to store the dynamic collection definitions for rebuild
   * @default "./dynamicCollections.json"
   */
  collectionPath?: string

  /**
   * Extra data that can be added to the dynamic collection configuration
   * @default []
   */
  extraCollectionData?: Field[]

  /**
   * Extra data that can be added to the each field of the dynamic collection configuration
   * @default []
   */
  extraFieldData?: Field[]

  /**
   * Access permissions for editing and viewing collections and versions. Open to all users by default
   */
  access?: {
    createVersion: Access
    editCollections: Access
    viewVersions: Access
    viewCollections: Access
  }

  /**
   * The record of access functions that can be chosen for dynamic collections. `open` and `allUsers` are provided
   * and `allUsers` is selected by default in new collections. For more information see https://payloadcms.com/docs/access-control/overview
   * @default {}
   */
  collectionAccessFunctions?: Record<string, Access>

  /**
   * The record of access functions that can be chosen for the fields of dynamic collections. `open` and `allUsers` are provided
   * and `allUsers` is selected by default in new fields. For more information see https://payloadcms.com/docs/access-control/overview
   * @default {}
   */
  fieldAccessFunctions?: Record<string, FieldAccess>

  /**
   * The record of functions that can be chosen to resolve if a collection is hidden in the admin console.
   * The function is called with the current user object. The functions `always` and `never` are available.
   * For more information see https://payloadcms.com/docs/configuration/collections#admin-options
   * @default {}
   */
  hiddenFunctions?: Record<string, Hidden>

  /**
   * The record of collection hooks available for each hook type. Hooks can either be passed in raw
   * or as a `HookWithProps`. For more information on hooks with props, see the README. No hooks are
   * included by default.
   */
  collectionHooks?: {
    beforeOperation?: Record<
      string,
      CollectionBeforeOperationHook | HookWithProps<CollectionBeforeOperationHook>
    >
    beforeValidate?: Record<
      string,
      CollectionBeforeValidateHook | HookWithProps<CollectionBeforeValidateHook>
    >
    beforeChange?: Record<
      string,
      CollectionBeforeChangeHook | HookWithProps<CollectionBeforeChangeHook>
    >
    afterChange?: Record<
      string,
      CollectionAfterChangeHook | HookWithProps<CollectionAfterChangeHook>
    >
    beforeRead?: Record<string, CollectionBeforeReadHook | HookWithProps<CollectionBeforeReadHook>>
    afterRead?: Record<string, CollectionAfterReadHook | HookWithProps<CollectionAfterReadHook>>
    beforeDelete?: Record<
      string,
      CollectionBeforeDeleteHook | HookWithProps<CollectionBeforeDeleteHook>
    >
    afterDelete?: Record<
      string,
      CollectionAfterDeleteHook | HookWithProps<CollectionAfterDeleteHook>
    >
    afterOperation?: Record<
      string,
      CollectionAfterOperationHook | HookWithProps<CollectionAfterOperationHook>
    >
  }

  /**
   * The record of field hooks available for each hook type. Hooks must be passed in raw.
   * No hooks are included by default
   */
  fieldHooks?: {
    beforeValidate?: Record<string, FieldHook>
    beforeChange?: Record<string, FieldHook>
    afterChange?: Record<string, FieldHook>
    afterRead?: Record<string, FieldHook>
  }

  /**
   * Any fields that should be common to all dynamic collections can be defined here.
   * @default []
   */
  commonFields?: Field[]
}

export type Hidden = (args: unknown) => boolean

export type SupportedField = Exclude<
  Field,
  | BlockField
  | UploadField
  | CollapsibleField
  | RadioField
  | RichTextField
  | TabsField
  | UIField
  | RowField
>

export type CollectionFieldEntries = Array<{
  def: {
    [k: string]: unknown
  }
  hooks?: CollectionFieldHooks
  access?: CollectionFieldAccess
}>

export type RawDynamicFieldDef = CollectionFieldEntries[0]['def']

export interface DynamicCollection {
  slug: string
  defaultSort?: string | null
  labels?: CollectionLabels
  graphQL?: CollectionGraphQLConfig
  fields: CollectionFieldEntries
  group?: string | null
  useAsTitle?: string | null
  hidden?: ('always' | 'never') | string | null
  access?: CollectionAccess
  hooks?: CollectionHooks
  updatedAt: string
  createdAt: string
}

export interface CollectionLabels {
  singular?: string | null
  plural?: string | null
}

export interface CollectionGraphQLConfig {
  singularName?: string | null
  pluralName?: string | null
  allow?: boolean | null
}

export interface CollectionFieldHooks {
  beforeValidate?: string[] | null
  beforeChange?: string[] | null
  afterChange?: string[] | null
  afterRead?: string[] | null
}

export interface CollectionFieldAccess {
  create?: ('open' | 'allUsers') | string | null
  read?: ('open' | 'allUsers') | string | null
  update?: ('open' | 'allUsers') | string | null
}

export interface CollectionAccess {
  create?: ('open' | 'allUsers') | string | null
  read?: ('open' | 'allUsers') | string | null
  update?: ('open' | 'allUsers') | string | null
  delete?: ('open' | 'allUsers') | string | null
}

export interface CollectionHooks {
  beforeOperation?: string[] | null
  beforeValidate?: string[] | null
  beforeChange?: string[] | null
  afterChange?: string[] | null
  beforeRead?: string[] | null
  afterRead?: string[] | null
  beforeDelete?: string[] | null
  afterDelete?: string[] | null
  afterOperation?: string[] | null

  hookProps?: {
    beforeOperation?: Record<string, unknown>
    beforeValidate?: Record<string, unknown>
    beforeChange?: Record<string, unknown>
    afterChange?: Record<string, unknown>
    beforeRead?: Record<string, unknown>
    afterRead?: Record<string, unknown>
    beforeDelete?: Record<string, unknown>
    afterDelete?: Record<string, unknown>
    afterOperation?: Record<string, unknown>
  }
}

export interface Version {
  version: string
  collectionDefinitions: DynamicCollection[]
  id: string
}
