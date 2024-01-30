import type { PaginatedDocs } from 'payload/database'
import * as jsEnv from 'browser-or-node'
import payload from 'payload'
import type { Version } from '../../types'

const getNewestVersion = async (payloadInstance = payload): Promise<string | false> => {
  if (jsEnv.isBrowser) {
    const res = await fetch('/api/versions?sort=-createdAt&limit=1', {
      method: 'GET',
      credentials: 'include',
    })

    const { docs } = (await res.json()) as PaginatedDocs<Version>
    const newestVersion = docs.length === 1 ? docs[0].version : false
    return newestVersion
  }
  if (jsEnv.isNode) {
    const res = await payloadInstance.find({
      collection: 'versions',
      limit: 1,
      sort: '-createdAt',
    })

    const { docs } = res
    if (docs.length === 0) {
      return false
    }

    const newestVersion = docs[0] as unknown as Version
    return newestVersion.version
  }
  return false
}

export default getNewestVersion
