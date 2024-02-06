import React from 'react'
import type { Props as CellProps } from 'payload/components/views/Cell'
import { Button } from 'payload/components/elements'
import { useDocumentInfo } from 'payload/dist/admin/components/utilities/DocumentInfo'

const baseClass = 'btn--style-secondary'

/**
 * Sets the `currentVersion` global to the version specified by `id`
 * A popup will either confirm the change was successful, or notify
 * the user that an error occured.
 * @param id
 */
const setVersion = (id: string) => {
  fetch('/api/globals/currentVersion', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentVersion: id,
    }),
  }).then(res => {
    if (res.ok) {
      // eslint-disable-next-line no-alert
      window.alert('Version update successful')
    } else {
      // eslint-disable-next-line no-alert
      window.alert('Something went wrong')
    }
  })
}

/**
 * Adds a button to the version entry form in the admin console that
 * sets that version as the currently selected version
 */
export const SelectVersionField: React.FC = () => {
  const { id } = useDocumentInfo()

  return (
    <Button
      className={baseClass}
      size="small"
      onClick={e => {
        e.preventDefault()
        setVersion(id as string)
      }}
    >
      Set as current version
    </Button>
  )
}

/**
 * Adds a button to the version table in the admin console that
 * sets that version as the currently selected version
 */
export const SelectVersionCell: React.FC<CellProps> = props => {
  const { rowData } = props
  if (!('id' in rowData)) {
    return <text style={{ fontStyle: 'italic' }}>N/A</text>
  }

  const { id } = rowData

  return (
    <Button
      className={baseClass}
      size="small"
      onClick={e => {
        e.preventDefault()
        setVersion(id as string)
      }}
    >
      Set as current version
    </Button>
  )
}
