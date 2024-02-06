import type { CollectionConfig } from 'payload/types'
import generalConfig from './options/general'
import fieldsConfig from './options/fields'
import adminConfig from './options/admin'
import hooksAndAccessConfig from './options/hooksAndAccess'
import type { DynamicCollectionOptions } from '../types'
import { collectionAccess } from '../utils/access'

/**
 * This function returns the DynamicCollections collection configuration. The plugin options define
 * who can read and edit collections, as well as which hooks, access functions, and admin visibility
 * functions are available.
 * @param pluginOptions The plugin options passed by the user
 * @returns the dynamicCollection collection
 */
const DynamicCollection = (pluginOptions: DynamicCollectionOptions): CollectionConfig => {
  const {
    access = {
      editCollections: collectionAccess.allUsers,
      viewCollections: collectionAccess.allUsers,
    },
  } = pluginOptions
  const { editCollections, viewCollections } = access

  return {
    slug: 'dynamicCollection',
    versions: true,
    admin: {
      group: 'Dynamic Collection Configuration',
      useAsTitle: 'slug',
      pagination: {
        defaultLimit: 100,
      },
    },
    access: {
      create: editCollections,
      read: viewCollections,
      update: editCollections,
      delete: editCollections,
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          generalConfig(),
          fieldsConfig(pluginOptions),
          adminConfig(pluginOptions),
          hooksAndAccessConfig(pluginOptions),
        ],
      },
    ],
  }
}

export default DynamicCollection
