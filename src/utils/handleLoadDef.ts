import * as jsEnv from 'browser-or-node'
import { readFileSync, writeFileSync } from 'fs'
import type { Payload } from 'payload'
import payload from 'payload'
import type { Version } from '../types'
import { emptyVersion } from './constants'

/**
 * This function reads the most up-to-date version and dynamic collection information.
 * When called by the payload server, the locally storred information is read at `path`
 *
 * When called by an admin client, the `currentVersion` global is queried.
 * @param path The file path where the collection definitions are stored for rebuild
 * @returns The most up-to-date version information and collection definitions
 */
async function ReadCollectionDefs(path = './dynamicCollections.json'): Promise<Version> {
  // If the environment is the browser, fetch the current version from the server
  if (jsEnv.isBrowser) {
    const res = await fetch('/api/globals/currentVersion', {
      method: 'GET',
      credentials: 'include',
    })

    const { currentVersion } = await res.json()
    const sanitizedCurrentVersion =
      !currentVersion || typeof currentVersion === 'string' ? emptyVersion : currentVersion
    return sanitizedCurrentVersion
  }

  // If the environment is Node.js, fetch the current version from the local file system
  if (jsEnv.isNode) {
    try {
      const data = readFileSync(path, 'utf-8')
      const currentVersion = JSON.parse(data)
      const sanitizedCurrentVersion: Version =
        !currentVersion || typeof currentVersion === 'string' ? emptyVersion : currentVersion
      return sanitizedCurrentVersion
    } catch {
      return emptyVersion
    }
  }

  return emptyVersion
}

/**
 * This function takes the currently selected version and writes the version information
 * and collection definitions to the server's local storage.
 * @param path The file path where the collection definitions will be stored for rebuild
 * @param payloadInstance The current payload instance
 */
async function WriteCollectionDefs(
  path: string,
  payloadInstance: Payload = payload,
): Promise<void> {
  // If the environment is the browser, do nothing
  if (jsEnv.isBrowser) {
    return
  }

  // If the environment is Node.js, write the current version to the local file system
  if (jsEnv.isNode) {
    const { currentVersion } = await payloadInstance.findGlobal({
      slug: 'currentVersion', // required
    })

    const sanitizedCurrentVersion =
      !currentVersion || typeof currentVersion === 'string' ? emptyVersion : currentVersion

    writeFileSync(path, JSON.stringify(sanitizedCurrentVersion, null, ' '))
  }
}

export { ReadCollectionDefs, WriteCollectionDefs }
