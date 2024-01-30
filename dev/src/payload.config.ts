import type { Config } from 'payload/config'
import { buildConfig } from 'payload/config'
import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { slateEditor } from '@payloadcms/richtext-slate'
import Users from './collections/Users'
import type { DynamicCollectionOptions } from '../../src/index'
import { dynamicCollectionsPlugin } from '../../src/index'
import { collectionAccess, fieldAccess } from './access'
import hidden from './hidden'
import { collectionHooks, fieldHooks } from './hooks'

const dynamicCollectionOptions: DynamicCollectionOptions = {
  enabled: true,
  access: {
    createVersion: collectionAccess.isAdmin,
    viewVersions: collectionAccess.isAdmin,
    editCollections: collectionAccess.isAdmin,
    viewCollections: collectionAccess.isAdmin,
  },
  collectionAccessFunctions: collectionAccess,
  fieldAccessFunctions: fieldAccess,
  hiddenFunctions: hidden,
  collectionHooks,
  fieldHooks,
}

const conf: Config = {
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
          },
        },
      }
      return newConfig
    },
  },
  editor: slateEditor({}),
  collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [dynamicCollectionsPlugin(dynamicCollectionOptions)],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
}

export default buildConfig(conf)
