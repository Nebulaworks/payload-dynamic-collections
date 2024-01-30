import type { Tab } from 'payload/types'
import hidden from '../../utils/hidden'
import type { DynamicCollectionOptions } from '../../types'

/**
 * Returns the dynamicCollection configuration fields responsible for configuring
 * how the collection behaves in the admin console. The plugin options provide the
 * admin visibility (hidden) functions available to the user
 * @param pluginOptions The plugin options passed by the user
 * @returns The dynamicCollection fields associated with field level access
 */
const adminConfig = (pluginOptions: DynamicCollectionOptions): Tab => {
  return {
    label: 'Admin Options',
    description: 'Collection Options for the Admin Console',
    fields: [
      {
        name: 'group',
        type: 'text',
      },
      {
        name: 'useAsTitle',
        type: 'text',
      },
      {
        name: 'hidden',
        type: 'select',
        options: Object.keys({
          ...hidden,
          ...(pluginOptions.hiddenFunctions ? pluginOptions.hiddenFunctions : {}),
        }),
      },
    ],
  }
}

export default adminConfig
