import type { Plugin } from 'payload/config'

import type { CollectionConfig } from 'payload/types'
import { checkVersion, logLoadedVersion } from './onInitPlugin'
import type { DynamicCollectionOptions } from './types'
import { extendWebpackConfig } from './webpack'
import DisplayCollectionsVersion from './components/DisplayVersion'
import DynamicCollection from './DynamicCollection'
import { Versions, CurrentVersion } from './Versions'
import { ReadCollectionDefs } from './utils/handleLoadDef'
import DeriveCollection from './CollectionDerivation'

// type PluginType = (pluginOptions: PluginTypes) => Plugin

export const dynamicCollectionsPlugin =
  (pluginOptions: DynamicCollectionOptions): Plugin =>
  async incomingConfig => {
    const { enabled = false, collectionPath = './dynamicCollections.json' } = pluginOptions
    const config = { ...incomingConfig }

    // Read locally storred collection definitions
    const { version, collectionDefinitions } = await ReadCollectionDefs(collectionPath)

    // Derive and sanitize dynamic collection definitions
    const derivedCollections = collectionDefinitions.map(collection =>
      DeriveCollection(collection, pluginOptions),
    )
    const [sanitizedCollections, collectionErrors] = derivedCollections.reduce(
      ([cols, errs], cur) => {
        if (typeof cur === 'string') {
          return [cols, [...errs, cur]]
        }

        return [[...cols, cur], errs]
      },
      [[] as CollectionConfig[], [] as string[]],
    )

    const webpack = extendWebpackConfig(incomingConfig)

    config.admin = {
      ...(config.admin || {}),
      webpack,

      components: {
        ...(config.admin?.components || {}),

        // Add dynamic collection information to dashboard
        beforeDashboard: [
          ...(config.admin?.components?.beforeDashboard || []),
          DisplayCollectionsVersion(version),
        ],
      },
    }

    if (enabled === false) {
      return config
    }

    config.collections = [
      ...(config.collections || []),
      DynamicCollection(pluginOptions),
      Versions(pluginOptions),
      ...sanitizedCollections,
    ]

    config.globals = [...(config.globals || []), CurrentVersion(pluginOptions)]

    config.onInit = async payload => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)

      logLoadedVersion(version, sanitizedCollections, collectionErrors, payload)
      checkVersion(collectionPath, version, payload)
    }

    return config
  }
