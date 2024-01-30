import type { Payload } from 'payload/dist/payload'

import type { CollectionConfig } from 'payload/types'
import type { Version } from './types'
import { WriteCollectionDefs } from './utils/handleLoadDef'
import { emptyVersion } from './utils/constants'

/**
 * Prints dynamic collection information to the Payload logs on startup.
 * The version number, number of collections, and any derivation errors are logged
 * @param loadedVersion The version number for the current set of dynamic collections
 * @param loadedCollections The list of dynamic collections loaded
 * @param collectionErrors A list of any errors that occured during collection derivation
 * @param payload The current payload instance
 */
export const logLoadedVersion = (
  loadedVersion: string,
  loadedCollections: CollectionConfig[],
  collectionErrors: string[],
  payload: Payload,
): void => {
  const numCollections = loadedCollections.length
  payload.logger.info(
    `Loaded Dynamic Collections version ${loadedVersion} (${numCollections} Collection${
      numCollections === 1 ? '' : 's'
    } loaded)`,
  )

  collectionErrors.forEach(error => {
    payload.logger.error(error)
  })
}

/**
 * This function spawns an interval that continuously compares the currently loaded
 * dynamic collection version against the `currentVersion` global. If they differ,
 * the system is rebuilt to align with the global value. Note: this will only work
 * correctly if the system automatically restarts when exited. PM2 is helpful for ensuring
 * this works as intended
 * @param collectionPath Where the dynamic collection definitions are storred locally for the next rebuild.
 * @param loadedVersion The version number currently loaded
 * @param payload The payload instance with which the `currentVersion` global is checked
 */
export const checkVersion = async (
  collectionPath: string,
  loadedVersion: string,
  payload: Payload,
): Promise<void> => {
  // ensure app is running
  const { express: app } = payload
  if (!app) return

  const getCurrentVersion = async (): Promise<string> => {
    const { currentVersion } = await payload.findGlobal({
      slug: 'currentVersion',
    })

    if (typeof currentVersion === 'string') {
      return emptyVersion.version
    }

    const { version } = currentVersion as Version
    return version
  }

  setInterval(async () => {
    const currentVersion = await getCurrentVersion()

    // If a version descrepancy is detected, save collection defs locally and exit task
    if (loadedVersion !== currentVersion) {
      await WriteCollectionDefs(collectionPath, payload)
      payload.logger.info(
        `Outdated dynamic collections detected; upadting to version ${currentVersion}`,
      )
      process.exit(1)
    }
  }, 5000)
}
