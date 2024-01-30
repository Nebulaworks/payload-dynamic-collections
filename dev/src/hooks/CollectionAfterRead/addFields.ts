import type { Field, CollectionAfterReadHook } from 'payload/types'
import type { AddFieldsProps } from 'payload/generated-types'
import type { HookWithProps } from '../../../../src/types'

const propsStructure: Field = {
  type: 'array',
  name: 'addFields',
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
