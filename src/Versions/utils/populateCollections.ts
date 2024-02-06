import type { CollectionBeforeChangeHook } from 'payload/types'
import type { PaginatedDocs } from 'payload/database'
import type { DynamicCollection, Version } from '../../types'

/**
 * This hook populates new versions with the most up-to-date collections from
 * the DynamicCollections collection when that version is first created.
 */
export const populateCollections: CollectionBeforeChangeHook<Version> = async ({
  operation,
  data,
  req,
}) => {
  if (operation !== 'create') {
    return data
  }

  const collections: DynamicCollection[] = await req.payload
    .find({
      collection: 'dynamicCollection',
      limit: 2147483647,
    })
    .then((result: PaginatedDocs<DynamicCollection>) => {
      return result.docs
    })
    .catch(() => [])

  return { ...data, collectionDefinitions: collections }
}
