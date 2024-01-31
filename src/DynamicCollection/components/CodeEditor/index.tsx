import Editor from '@monaco-editor/react'
import React from 'react'

import type { Props } from './types'

import './index.scss'

const baseClass = 'code-editor'

/**
 * A code editor component that uses Monaco Editor.
 */
const CodeEditor: React.FC<Props> = props => {
  const { className, height, options, readOnly, ...rest } = props

  const classes = [
    baseClass,
    className,
    rest?.defaultLanguage ? `language--${rest.defaultLanguage}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Editor
      className={classes}
      height={height}
      options={{
        detectIndentation: true,
        minimap: {
          enabled: false,
        },
        readOnly: Boolean(readOnly),
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: 'on',
        ...options,
      }}
      theme={'vs-dark'}
      {...rest}
    />
  )
}

export default CodeEditor
