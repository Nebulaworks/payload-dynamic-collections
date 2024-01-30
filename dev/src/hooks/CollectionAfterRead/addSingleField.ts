import type { Field, CollectionAfterReadHook } from 'payload/types'
import type { AddSingleFieldProps } from 'payload/generated-types'
import type { HookWithProps } from '../../../../src/types'

const propsStructure: Field = {
  type: 'group',
  name: 'addSingleField',
  interfaceName: 'AddSingleFieldProps',
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
