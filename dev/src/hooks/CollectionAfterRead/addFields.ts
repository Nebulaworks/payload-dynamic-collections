import type { Field, CollectionAfterReadHook } from 'payload/types'
import type { AddFieldsProps } from 'payload/generated-types'
import type { HookWithProps } from '../../../../src/types'

// This is the structure of the props that are passed to the hook
// This example shows a hook with a array of properties
const propsStructure: Field = {
  type: 'array',
  name: 'addFields',
  // Set the interface name to reuse the type definition in the hook generator
  interfaceName: 'AddFieldsProps',
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

const addFields: HookWithProps<CollectionAfterReadHook> = {
  propsStructure,
  generator: (props: Exclude<AddFieldsProps, null>): CollectionAfterReadHook => {
    const hook: CollectionAfterReadHook = async ({ doc }) => {
      const additionalFields = props.reduce(
        (acc, cur) => ({ ...acc, [cur.fieldName]: cur.fieldValue }),
        {},
      )
      return { ...doc, ...additionalFields }
    }

    return hook
  },
}

export default addFields
