/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useFormFields } from 'payload/components/forms'

import './index.scss'
import { DynamicCollection, DynamicCollectionOptions, HookWithProps } from '../../../types'
import { HookPropsSelector } from './PropInputBuilder'

export type CollectionHooks = Exclude<DynamicCollectionOptions['collectionHooks'], undefined>

type HookTypeGroupProps = {
  hookType: string
  hooks: Record<string, HookWithProps<unknown>>
}
const HookTypeGroup: React.FC<HookTypeGroupProps> = ({ hookType, hooks }) => {
  return (
    <div className="field-type group-field group-field--within-group group-field--within-tab group-field--gutter">
      <h3>{hookType}</h3>
      {Object.keys(hooks).map(hook => {
        return (
          <div style={{ marginBottom: '25px' }}>
            <HookPropsSelector hookName={hook} hook={hooks[hook]} />{' '}
          </div>
        )
      })}
    </div>
  )
}

const HookPropsField = (collectionHooks: CollectionHooks = {}): React.FC => {
  // Get hook with prop definition if it exists. If the hook either
  // doesn't exist or is a function, return false.
  const getHookWithProps = (
    hookType: keyof CollectionHooks,
    hookName: string,
  ): false | HookWithProps<unknown> => {
    // Get the hook type from the collection hooks, if it exists
    const { [hookType]: hooksOfType } = collectionHooks
    if (!hooksOfType) {
      return false
    }

    // Get the hook from the hook type, if it exists
    const { [hookName]: hook } = hooksOfType
    if (!hook) {
      return false
    }

    // If the hook is just a function, it doesn't have props
    if (typeof hook === 'function') {
      return false
    }

    return hook
  }

  const component: React.FC = () => {
    // const { getData } = useForm()

    // Get hookParameters and which hooks have been chosen from the form
    const hookConfig = useFormFields(([fields, dispatch]) => {
      return {
        hookParameters: fields['hooks.hookParameters']?.value,
        beforeOperation: fields['hooks.beforeOperation']?.value,
        beforeValidate: fields['hooks.beforeValidate']?.value,
        beforeChange: fields['hooks.beforeChange']?.value,
        afterChange: fields['hooks.afterChange']?.value,
        beforeRead: fields['hooks.beforeRead']?.value,
        afterRead: fields['hooks.afterRead']?.value,
        beforeDelete: fields['hooks.beforeDelete']?.value,
        afterDelete: fields['hooks.afterDelete']?.value,
        afterOperation: fields['hooks.afterOperation']?.value,
      }
    }) as unknown as DynamicCollection['hooks']

    // Separate the hook parameters from the chosen hooks
    const { hookParameters = {}, ...hooks } = hookConfig ?? {}

    // Get all chosen hooks that have props
    const hooksWithProps = useMemo(() => {
      const hookTypes = Object.keys(hooks) as Array<keyof typeof hooks>

      return hookTypes.reduce((accHooksWithProps, hookType) => {
        const hookNames = hooks[hookType]

        // if the current type has no hook names, continue to next type
        if (!hookNames) {
          return accHooksWithProps
        }

        // Get all hooks with props for the current type
        const hooksWithPropsOfType = hookNames.reduce((accHooksOfType, hookName) => {
          const maybeHookWithProps = getHookWithProps(hookType, hookName)

          if (!maybeHookWithProps) {
            return accHooksOfType
          }

          return { ...accHooksOfType, [hookName]: maybeHookWithProps }
        }, {} as Record<string, HookWithProps<unknown>>)

        // If no hooks with props were found for the current type, continue to next type
        if (Object.keys(hooksWithPropsOfType).length === 0) {
          return accHooksWithProps
        }

        return { ...accHooksWithProps, [hookType]: hooksWithPropsOfType }
      }, {} as Record<keyof typeof hooks, Record<string, HookWithProps<unknown>>>)
    }, [hooks])

    // If no hooks with props have been chosen, don't render
    if (Object.keys(hooksWithProps).length === 0) {
      return null
    }

    // Create a new component for each hook type that has a hook with props selected
    const hookTypeSelectors = (
      Object.keys(hooksWithProps) as Array<keyof typeof hooksWithProps>
    ).map(hookType => <HookTypeGroup hookType={hookType} hooks={hooksWithProps[hookType]} />)

    return (
      <div className="render-fields render-fields--margins-small">
        <h3>Hook Parameters</h3>
        {hookTypeSelectors}
      </div>
    )
  }
  return component
}

const HookPropsCell = () => <text style={{ fontStyle: 'italic' }}>N/A</text>

export { HookPropsField, HookPropsCell }
