import type { Version } from '../types'

const emptyVersion: Version = {
  version: '0',
  collectionDefinitions: [],
  id: '',
}

type CollectionHookTypes = Array<
  | 'beforeOperation'
  | 'beforeValidate'
  | 'beforeChange'
  | 'afterChange'
  | 'beforeRead'
  | 'afterRead'
  | 'beforeDelete'
  | 'afterDelete'
  | 'afterOperation'
>

const collectionHookTypes: CollectionHookTypes = [
  'beforeOperation',
  'beforeValidate',
  'beforeChange',
  'afterChange',
  'beforeRead',
  'afterRead',
  'beforeDelete',
  'afterDelete',
  'afterOperation',
]

type FieldHookTypes = Array<'beforeValidate' | 'beforeChange' | 'afterChange' | 'afterRead'>

const fieldHookTypes: FieldHookTypes = [
  'beforeValidate',
  'beforeChange',
  'afterChange',
  'afterRead',
]

export { emptyVersion, collectionHookTypes, fieldHookTypes }
