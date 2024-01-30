import addFields from './CollectionAfterRead/addFields'
import addSingleField from './CollectionAfterRead/addSingleField'
import logCollectionRead from './CollectionAfterRead/logCollectionRead'
import logFieldAfterRead from './FieldAfterRead/logFieldAfterRead'

const afterRead = {
  basicHook: logCollectionRead,
  addFields,
  addSingleField,
}

const collectionHooks = {
  afterRead,
}

const fieldHooks = {
  afterRead: { logFieldAfterRead },
}

export { collectionHooks, fieldHooks }
