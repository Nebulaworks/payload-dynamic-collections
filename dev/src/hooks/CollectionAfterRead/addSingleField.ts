import type { Field, CollectionAfterReadHook } from 'payload/types'
import type { AddSingleFieldProps } from 'payload/generated-types'
import type { HookWithProps } from '../../../../src/types'

// This is the structure of the props that are passed to the hook
// This example shows a hook with a group of properties
const propsStructure: Field = {
  type: 'group',
  name: 'addSingleField',
  // Set the interface name to reuse the type definition in the hook generator
  interfaceName: 'AddSingleFieldProps',
  // For groups, it is recommended to hide the gutter to make the admin UI look better
  admin: {
    hideGutter: true,
  },
  fields: [
    {
      type: 'text',
      name: 'fieldName',
      required: true,
    },
    {
      type: 'text',
      name: 'fieldValue',
      required: true,
    },
  ],
}

const addSingleField: HookWithProps<CollectionAfterReadHook> = {
  propsStructure,
  generator: (props: Exclude<AddSingleFieldProps, null>): CollectionAfterReadHook => {
    const hook: CollectionAfterReadHook = async ({ doc }) => {
      return { ...doc, [props.fieldName]: props.fieldValue }
    }

    return hook
  },
}

export default addSingleField
