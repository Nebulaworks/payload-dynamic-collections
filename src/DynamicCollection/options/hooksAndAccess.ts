import type { Field, Tab } from 'payload/types'
import type { DynamicCollectionOptions } from '../../types'
import { collectionHookTypes } from '../../utils/constants'
import { HookPropsCell } from '../components/HookPropsSelector'

export type CollectionHooks = Exclude<DynamicCollectionOptions['collectionHooks'], undefined>

/**
 * Returns a field for the hook props selector, if any
 * @param collectionHooks The collection hooks passed by the user
 * @returns A field for the hook props selector, if any
 */
const hookProps = (collectionHooks: CollectionHooks = {}): Field | null => {
  // Create a field for each hook with props and group them by hook type
  // Additionally, create a map of hook with props names to hook types
  const [hooksTypeFields, hooksTypeNames] = (
    Object.keys(collectionHooks) as Array<keyof CollectionHooks>
  ).reduce(
    ([accTypeFields, accTypeNames], hookType) => {
      // Get hooks of the current type, if any
      const hooks = collectionHooks[hookType]
      if (!hooks) {
        return [accTypeFields, accTypeNames]
      }

      // Create a field for each hook with props using the props structure
      // Additionally, gather the names of the hooks with props
      const [hookFields, hookNames] = Object.keys(hooks).reduce(
        ([accHookFields, accHookNames], hookName) => {
          // Get the hook, if it is a function, it has no props
          const hook = hooks[hookName]
          if (typeof hook === 'function') {
            return [accHookFields, accHookNames]
          }

          // Create a collapisble field for the hook with props
          const { propsStructure } = hook
          const hookWithProps: Field = {
            type: 'collapsible',
            label: hookName,
            admin: {
              // Only show the props selector if the corresponding hook is selected
              condition: data => {
                const { [hookType]: chosenHooks } = data.hooks
                if (!chosenHooks) {
                  return false
                }

                return chosenHooks.includes(hookName)
              },
            },
            fields: [{ ...propsStructure, name: hookName }],
          }

          // Add the hook with props to the accumulator
          return [
            [...accHookFields, hookWithProps],
            [...accHookNames, hookName],
          ]
        },
        [[] as Field[], [] as string[]],
      )

      // Create a group field for the hook type
      const hookTypeGroup: Field = {
        type: 'group',
        name: hookType,
        fields: hookFields,
        admin: {
          // Only show the hook type if any of the hooks with props are selected
          condition: data => {
            const { [hookType]: chosenHooks } = data.hooks
            if (!chosenHooks) {
              return false
            }

            return hookNames.reduce((acc, cur) => acc || chosenHooks.includes(cur), false)
          },
        },
      }

      return [[...accTypeFields, hookTypeGroup], { ...accTypeNames, [hookType]: hookNames }]
    },
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    [[] as Field[], {} as Record<keyof CollectionHooks, string[]>],
  )

  // If there are no hooks with props, return null
  if (Object.keys(hooksTypeFields).length === 0) {
    return null
  }

  // Create a group field for all hooks with props
  return {
    type: 'group',
    name: 'hookProps',
    admin: {
      hideGutter: true,
      // Only show the hook props if any of the hooks with props are selected
      condition: data => {
        return (Object.keys(hooksTypeNames) as Array<keyof CollectionHooks>).reduce(
          (accType, typeName) => {
            const hookNames = hooksTypeNames[typeName]
            const chosenHooks = data.hooks[typeName]
            if (!chosenHooks) {
              return accType
            }
            return (
              accType || hookNames.reduce((acc, cur) => acc || chosenHooks.includes(cur), false)
            )
          },
          false,
        )
      },
    },
    fields: hooksTypeFields,
  }
}

/**
 * Returns the dynamicCollection configuration fields responsible for setting hooks and access
 * The plugin options handle which hooks and access functions are available
 * @param pluginOptions The plugin options passed by the user
 * @returns The dynamicCollection fields associated with hooks and access
 */
const hooksAndAccessConfig = (pluginOptions: DynamicCollectionOptions): Tab => {
  const { collectionHooks, collectionAccessFunctions } = pluginOptions

  const accessFuntionNames = [
    'open',
    'allUsers',
    ...(collectionAccessFunctions !== undefined ? Object.keys(collectionAccessFunctions) : []),
  ]

  const hookSelectorFields = collectionHookTypes.reduce((acc, cur) => {
    if (collectionHooks === undefined) {
      return acc
    }

    const hooks = collectionHooks[cur]
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

  const hooksWithPropsGroup = hookProps(collectionHooks)

  return {
    label: 'Hooks and Access',
    description: 'Options for collection accessibility, visability, and hooks',
    fields: [
      {
        name: 'access',
        interfaceName: 'CollectionAccess',
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
              {
                name: 'delete',
                type: 'select',
                options: accessFuntionNames,
                defaultValue: 'allUsers',
              },
            ],
          },
        ],
      },
      {
        name: 'hooks',
        interfaceName: 'CollectionHooks',
        type: 'group',
        admin: {
          hideGutter: true,
        },
        fields: [
          {
            label: ' ',
            type: 'collapsible',
            fields: hookSelectorFields,
          },
          ...(hooksWithPropsGroup ? [hooksWithPropsGroup] : []),
        ],
      },
    ],
  }
}

export default hooksAndAccessConfig
