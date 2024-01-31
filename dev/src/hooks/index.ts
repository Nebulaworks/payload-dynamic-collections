import addFields from './CollectionAfterRead/addFields'
import addSingleField from './CollectionAfterRead/addSingleField'
import logCollectionRead from './CollectionAfterRead/logCollectionRead'
import logFieldAfterRead from './FieldAfterRead/logFieldAfterRead'

// Create a hook object for each hook type you have created hooks for
const afterRead = {
  basicHook: logCollectionRead,
  addFields,
  addSingleField,
}

// Create a collectionHooks object with any collection hook types you have created hooks for
const collectionHooks = {
  afterRead,
}

// Create a fieldHooks object with any field hook types you have created hooks for
const fieldHooks = {
  afterRead: { logFieldAfterRead },
}

export { collectionHooks, fieldHooks }
