import type { CollectionConfig, GlobalConfig } from 'payload/types'
import semver from 'semver'
import { collectionAccess } from '../utils/access'
import { DisplayCollectionCount } from './components/displayCollectionCount'
import { SelectVersionCell, SelectVersionField } from './components/selectVersion'
import { populateCollections } from './utils/populateCollections'
import type { DynamicCollectionOptions } from '../types'
import getNewestVersion from './utils/getNewestVersion'

/**
 * This function creates the `versions` collection. This is where users can create new dynamic collection
 * versions and set them as the current version.
 * @param pluginOptions The plugin configuration. Used by this function to set access permissions
 * @returns the `versions` collection.
 */
const Versions = (pluginOptions: DynamicCollectionOptions): CollectionConfig => {
  const {
    access = {
      createVersion: collectionAccess.allUsers,
      viewVersions: collectionAccess.allUsers,
    },
  } = pluginOptions
  const { createVersion = collectionAccess.allUsers, viewVersions = collectionAccess.allUsers } =
    access

  return {
    slug: 'versions',
    admin: {
      group: 'Dynamic Collection Configuration',
      useAsTitle: 'version',
      defaultColumns: ['version', 'createdAt', 'columnDefinitions', 'selectVersion'],
    },
    defaultSort: '-createdAt',
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'selectVersion',
            type: 'ui',
            admin: {
              components: {
                Field: SelectVersionField,
                Cell: SelectVersionCell,
              },
              width: '20%',
            },
          },
          {
            name: 'version',
            type: 'text',
            required: true,
            unique: true,
            // Sets the default value to the newest version number + 1 patch
            defaultValue: async () => {
              const newestVersion = await getNewestVersion()
              if (!newestVersion) {
                return '0.0.0'
              }

              return semver.inc(newestVersion, 'patch')
            },
            admin: {
              width: '80%',
            },
            // Validates that the version number is a valid semantic version and that it is greater than the newest version
            validate: async (val, { payload }) => {
              const version = semver.valid(val)
              if (version === null) {
                return 'Version number must be a valid semantic version'
              }

              // Gets newest version. If no version is found, newestVersion is false
              // and any valid version number shold be accepted
              const newestVersion = await getNewestVersion(payload)
              if (!newestVersion) {
                return true
              }

              return semver.gt(version, newestVersion)
                ? true
                : `Version numbers must only increase; the most recent version is ${newestVersion}`
            },
          },
        ],
      },

      {
        name: 'collectionDefinitions',
        type: 'json',
        defaultValue: [],
        // users should not edit collection definitions directly, only via the DynamicCollections collection
        access: {
          update: () => false,
          create: () => false,
        },
        admin: {
          editorOptions: {
            readOnly: true,
          },
          components: {
            Cell: DisplayCollectionCount,
          },
        },
      },
    ],
    hooks: {
      beforeChange: [populateCollections],
    },
    access: {
      read: viewVersions,
      create: createVersion,
      update: createVersion,
      delete: createVersion,
    },
  }
}

/**
 * This function creates the `currentVersion` global. This keeps track of which dynamic collection version should
 * be used by the Payload instance
 * @param pluginOptions The plugin configuration. Used by this function to set access permissions
 * @returns the `currentVersion` global.
 */
const CurrentVersion = (pluginOptions: DynamicCollectionOptions): GlobalConfig => {
  const {
    access = {
      createVersion: collectionAccess.allUsers,
      viewVersions: collectionAccess.allUsers,
    },
  } = pluginOptions
  const { createVersion = collectionAccess.allUsers, viewVersions = collectionAccess.allUsers } =
    access

  return {
    slug: 'currentVersion',
    admin: {
      group: 'Dynamic Collection Configuration',
    },
    fields: [
      {
        name: 'currentVersion',
        type: 'relationship',
        relationTo: 'versions',
        admin: {
          allowCreate: false,
          sortOptions: '-createdAt',
        },
      },
    ],
    access: {
      read: viewVersions,
      update: createVersion,
    },
  }
}

export { Versions, CurrentVersion }
