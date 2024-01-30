/* eslint-disable no-use-before-define */
import { Collapsible } from 'payload/components/elements'
import React from 'react'
import { AddElementButton } from './button'
import { HookProps, HookWithProps } from '../../../../types'

type HookPropInputProps = {
  fieldName: string
  fieldType: 'text' | 'number'
}
const HookPropInput: React.FC<HookPropInputProps> = ({ fieldName, fieldType }) => {
  const inputId = `field-${fieldName}`
  return (
    <div className={`field-type ${fieldType}`}>
      <label htmlFor={inputId}>{fieldName}</label>
      <div className="input-wrapper">
        <input id={inputId} name={fieldName} type={fieldType} />
      </div>
    </div>
  )
}
type HookGroupPropInputProps = {
  fieldName?: string
  structure: HookProps
}
const HookArrayPropInput: React.FC<HookGroupPropInputProps> = ({ fieldName, structure }) => {
  const elementName = fieldName ?? 'Prop'
  return (
    <div>
      {fieldName && (
        <>
          <hr />
          <h4>{fieldName}</h4>
        </>
      )}
      <HookGroupPropInput fieldName={`${elementName}-01`} structure={structure} />
      <HookGroupPropInput fieldName={`${elementName}-02`} structure={structure} />
      <AddElementButton
        elementName={elementName}
        onClick={e => {
          e.preventDefault()
        }}
      />
    </div>
  )
}
const HookGroupPropInput: React.FC<HookGroupPropInputProps> = ({ fieldName, structure }) => {
  const body = Object.keys(structure).map(subfieldName => {
    const fieldType = structure[subfieldName]
    if (typeof fieldType === 'string') {
      return <HookPropInput fieldName={subfieldName} fieldType={fieldType} />
    }

    if (fieldType?.array && !(typeof fieldType.array === 'string')) {
      return (
        <HookArrayPropInput fieldName={subfieldName} structure={fieldType.array as HookProps} />
      )
    }

    return <HookGroupPropInput fieldName={subfieldName} structure={fieldType as HookProps} />
  })

  if (fieldName) {
    return (
      <Collapsible header={fieldName}>
        <div className="render-fields render-fields--margins-small">{body}</div>
      </Collapsible>
    )
  }

  return <>{body}</>
}
type HookPropsSelectorProps = {
  hookName: string
  hook: HookWithProps<unknown>
  depth?: number
}
export const HookPropsSelector: React.FC<HookPropsSelectorProps> = ({ hookName, hook }) => {
  const { propsStructure } = hook

  const body = !propsStructure.array ? (
    <HookGroupPropInput structure={propsStructure as HookProps} />
  ) : (
    <HookArrayPropInput structure={propsStructure.array as HookProps} />
  )

  return (
    <Collapsible header={hookName}>
      <div className="render-fields render-fields--margins-small">{body}</div>
    </Collapsible>
  )
}
