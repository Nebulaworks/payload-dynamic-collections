import payload from 'payload'
import type { CollectionAfterReadHook } from 'payload/types'

/**
 * This simple example hook logs the collection that was read
 */
const logCollectionRead: CollectionAfterReadHook = ({ req, doc }) => {
  payload.logger.info(`Payload read on collection ${req?.collection?.config.slug}`)
  return doc
}

export default logCollectionRead
