import type { Field, Tab } from 'payload/types'
import { FieldsInput } from '../components/FieldTextInput'
import type { DynamicCollectionOptions } from '../../types'
import { fieldHookTypes } from '../../utils/constants'

/**
 * Returns the dynamicCollection configuration fields responsible for setting
 * the field level hooks for each field
 * @param pluginOptions The plugin options passed by the user
 * @returns The dynamicCollection fields associated with field level hooks
 */
const fieldHooksGroup = (pluginOptions: DynamicCollectionOptions): Field => {
  const { fieldHooks } = pluginOptions

  // Create a hook selector for each hook type that has hooks loaded
  const hookSelectorFields = fieldHookTypes.reduce((acc, cur) => {
    if (fieldHooks === undefined) {
      return acc
    }

    const hooks = fieldHooks[cur]
    if (hooks === undefined || Object.keys(hooks).length === 0) {
      return acc
    }

    const f: Field = {
      name: cur,
      type: 'select',
      options: Object.keys(hooks),
      hasMany: true,
    }

    return [...acc, f]
  }, [] as Field[])

  return {
    name: 'hooks',
    interfaceName: 'CollectionCollectionFieldHooks',
    type: 'group',
    fields: [
      {
        label: ' ',
        type: 'collapsible',
        fields: hookSelectorFields,
      },
    ],
  }
}

/**
 * Returns the dynamicCollection configuration fields responsible for setting
 * the field level access for each field
 * @param pluginOptions The plugin options passed by the user
 * @returns The dynamicCollection fields associated with field level access
 */
const fieldAccessGroup = (pluginOptions: DynamicCollectionOptions): Field => {
  const { fieldAccessFunctions } = pluginOptions

  const accessFuntionNames = [
    'open',
    'allUsers',
    ...(fieldAccessFunctions !== undefined ? Object.keys(fieldAccessFunctions) : []),
  ]
  return {
    name: 'access',
    interfaceName: 'CollectionFieldAccess',
    type: 'group',
    fields: [
      {
        label: ' ',
        type: 'collapsible',
        fields: [
          {
            name: 'create',
            type: 'select',
            options: accessFuntionNames,
            defaultValue: 'allUsers',
          },
          {
            name: 'read',
            type: 'select',
            options: accessFuntionNames,
            defaultValue: 'allUsers',
          },
          {
            name: 'update',
            type: 'select',
            options: accessFuntionNames,
            defaultValue: 'allUsers',
          },
        ],
      },
    ],
  }
}

/**
 * Returns the dynamicCollection configuration fields responsible for setting the fields
 * belonging to the dynamic collection. The plugin options handle which hooks and access
 * functions are available at a field level.
 * @param pluginOptions The plugin options passed by the user
 * @returns The dynamicCollection fields associated with fields
 */
const fieldsConfig = (pluginOptions: DynamicCollectionOptions): Tab => {
  return {
    label: 'Fields',
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'List View',
            fields: [
              {
                name: 'fields',
                type: 'array',
                interfaceName: 'CollectionFieldEntries',
                fields: [
                  {
                    name: 'def',
                    type: 'json',
                    defaultValue: {
                      name: '',
                      type: 'text',
                    },
                    required: true,
                  },
                  {
                    type: 'row',
                    fields: [fieldHooksGroup(pluginOptions), fieldAccessGroup(pluginOptions)],
                  },
                ],
                required: true,
              },
            ],
          },
          {
            label: 'Text View',
            fields: [
              {
                type: 'ui',
                name: 'fieldInput',
                label: 'Fields',
                admin: {
                  components: {
                    Field: FieldsInput,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  }
}

export default fieldsConfig
