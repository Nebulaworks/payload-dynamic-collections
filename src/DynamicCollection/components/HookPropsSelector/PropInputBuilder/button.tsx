import React, { MouseEventHandler } from 'react'

type AddElementButtonProps = {
  elementName: string
  onClick: MouseEventHandler<HTMLButtonElement>
}
export const AddElementButton: React.FC<AddElementButtonProps> = ({ elementName, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ marginTop: '10px' }}
      className="btn array-field__add-row btn--style-icon-label btn--icon btn--icon-style-with-border btn--size-medium btn--icon-position-left"
    >
      <span className="btn__content">
        <span className="btn__label">Add {elementName}</span>
        <span className="btn__icon">
          <svg className="icon icon--plus" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
            <line className="stroke" x1="12.4589" x2="12.4589" y1="16.9175" y2="8.50115"></line>
            <line className="stroke" x1="8.05164" x2="16.468" y1="12.594" y2="12.594"></line>
          </svg>
        </span>
      </span>
    </button>
  )
}
