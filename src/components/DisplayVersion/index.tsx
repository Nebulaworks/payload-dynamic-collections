import React from 'react'

import './index.scss'
import { ReadCollectionDefs } from '../../utils/handleLoadDef'

/**
 * Display the currently loaded dynamic collections version.
 * Trigger a page reload if the version is different from the current version.
 * @param version
 */
const DisplayCollectionsVersion = (version: string): React.FC<any> => {
  return () => {
    ReadCollectionDefs().then(({ version: currentVersion }) => {
      if (version !== currentVersion) {
        window.location.reload()
      }
    })
    return <h4>Loaded Dynamic Collections version {version}</h4>
  }
}

export default DisplayCollectionsVersion
