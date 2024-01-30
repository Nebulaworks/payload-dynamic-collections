import type { Tab } from 'payload/types'

/**
 * Returns the dynamicCollection configuration fields responsible for setting general
 * information about the collection; chief among them being the collection slug.
 */
const generalConfig = (): Tab => {
  return {
    label: 'Collection Configuration',
    description: 'General Options for the collection',
    fields: [
      {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        index: true,
        validate: (value = '') => {
          const invalidSlugs = ['user', 'collection']
          if (invalidSlugs.includes(value)) {
            return `Invalid slug: ${value}. Cannot be one of ${invalidSlugs.join(', ')}.`
          }
          return true
        },
      },
      {
        name: 'defaultSort',
        type: 'text',
      },
      {
        name: 'labels',
        interfaceName: 'CollectionLabels',
        type: 'group',
        fields: [
          {
            label: ' ',
            type: 'collapsible',
            fields: [
              {
                name: 'singular',
                type: 'text',
              },
              {
                name: 'plural',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        name: 'graphQL',
        interfaceName: 'CollectionGraphQLConfig',
        type: 'group',
        fields: [
          {
            label: ' ',
            type: 'collapsible',
            fields: [
              {
                name: 'singularName',
                type: 'text',
              },
              {
                name: 'pluralName',
                type: 'text',
              },
              {
                name: 'allow',
                type: 'checkbox',
                defaultValue: true,
              },
            ],
          },
        ],
      },
    ],
  }
}
export default generalConfig
