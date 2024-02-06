import React from 'react'
import type { Props } from 'payload/components/views/Cell'
import { DynamicCollection } from '../../../types'

const baseClass = 'custom-cell'

/**
 * Swaps the table view of the dynamic collection defitions to
 * simply display the number of dynamic collections
 */
export const DisplayCollectionCount: React.FC<Props> = props => {
  const { cellData } = props
  const numCollections = (cellData as DynamicCollection[]).length
  return (
    <span className={baseClass}>{`${numCollections} Collection${
      numCollections === 1 ? '' : 's'
    }`}</span>
  )
}
