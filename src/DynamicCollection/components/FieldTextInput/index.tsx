import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'payload/components/forms'

// eslint-disable-next-line import/no-unresolved
import CodeEditor from '../CodeEditor'
import { CollectionTextEditor } from './types'
import { CollectionFieldAccess, CollectionFieldEntries, CollectionFieldHooks } from '../../../types'

type CollectionField = CollectionFieldEntries[0]

const baseClass = 'json-field'

const fieldToEditor = (fieldDef: CollectionField): CollectionTextEditor => {
  const {
    def, // flatten to root
    access = {} as CollectionFieldAccess, // hide "open"
    hooks = {} as CollectionFieldHooks, // hide []
  } = fieldDef

  const newAccess = (Object.keys(access) as Array<keyof CollectionFieldAccess>).reduce(
    (acc, accessType) =>
      access[accessType] !== 'allUsers' ? { ...acc, [accessType]: access[accessType] } : acc,
    {} as CollectionFieldAccess,
  )

  const newHooks = (Object.keys(hooks) as Array<keyof CollectionFieldHooks>).reduce(
    (acc, hookType) => {
      const currentHook = hooks[hookType]
      if (!currentHook || currentHook.length === 0) {
        return acc
      }
      return { ...acc, [hookType]: hooks[hookType] }
    },
    {} as CollectionFieldHooks,
  )

  return {
    ...(def as object),
    ...(Object.keys(newAccess).length > 0 ? { access: newAccess } : {}),
    ...(Object.keys(newHooks).length > 0 ? { hooks: newHooks } : {}),
  }
}

const editorToField = (textDef: CollectionTextEditor): CollectionField => {
  const { access = {}, hooks = {}, ...def } = textDef

  return {
    def: { ...def },
    access,
    hooks,
  }
}

const FieldsInput: React.FC = () => {
  const { getData, removeFieldRow, addFieldRow, replaceFieldRow } = useForm()
  const { fields: untypedFields } = getData()

  const fields =
    typeof untypedFields === 'number'
      ? ([] as CollectionField[])
      : (untypedFields as CollectionField[])

  const [stringValue, setStringValue] = useState<string>(
    JSON.stringify(
      fields.map(field => fieldToEditor(field as CollectionField)),
      null,
      '  ',
    ),
  )

  useEffect(() => {
    const delayFormUpdate = setTimeout(async () => {
      try {
        const editorFields = JSON.parse(stringValue) as CollectionTextEditor[]
        const collectionFields = editorFields.map(field => editorToField(field))

        // TODO: handle errors

        let rowIndex = 0
        for (const data of collectionFields) {
          if (rowIndex >= fields.length) {
            await addFieldRow({
              path: 'fields',
              rowIndex,
              data,
            })
          } else {
            await replaceFieldRow({
              path: 'fields',
              rowIndex,
              data,
            })
          }
          rowIndex += 1
        }

        // Remove fields that no longer exist
        if (fields.length > collectionFields.length) {
          const rowsToRemove = Array.from(
            { length: fields.length - collectionFields.length },
            (_, index) => fields.length - 1 - index,
          )

          for (rowIndex of rowsToRemove) {
            await removeFieldRow({ path: 'fields', rowIndex })
          }
        }
      } catch (e) {
        // console.info(e);
      }
    }, 1000)
    return () => clearTimeout(delayFormUpdate)
  }, [stringValue])

  const handleChange = useCallback(
    (val: any) => {
      setStringValue(val)
    },
    [setStringValue],
  )

  return (
    <div
      className={[
        // fieldBaseClass,
        baseClass,
        // showError && "error",
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        height: '75vh',
        flexGrow: 1,
      }}
    >
      {/* <ErrorComp message={errorMessage} showError={showError} /> */}
      {/* <LabelComp htmlFor={`field-${path}`} label={label} required={required} /> */}
      <CodeEditor
        defaultLanguage="json"
        onChange={handleChange}
        value={stringValue}
        height="100%"
      />
      {/* <FieldDescription description={description} path={path} value={value} /> */}
    </div>
  )
}

const FieldsCell = () => <text style={{ fontStyle: 'italic' }}>N/A</text>

export { FieldsInput, FieldsCell }
