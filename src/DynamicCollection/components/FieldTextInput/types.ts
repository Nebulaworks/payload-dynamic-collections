import type {
  CollectionCollectionFieldHooks,
  CollectionFieldAccess,
  // eslint-disable-next-line import/no-unresolved
} from 'payload/generated-types'

export interface CollectionTextEditor {
  name?: string
  access?: CollectionFieldAccess
  hooks?: CollectionCollectionFieldHooks
}
