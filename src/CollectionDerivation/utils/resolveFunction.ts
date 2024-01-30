// Protect against invalid functions by returning an empty value

import type { HookWithProps } from '../../types'
import { validateFunction } from '../FieldDerivation/validate'

// for nonexistant functions.
const ResolveFunction = (
  propName: string,
  fnObject: Record<string, Function | HookWithProps<unknown>>,
  fnNames: string | string[] | undefined = '',
  props: Record<string, unknown> = {},
): object => {
  // If there's a single selected function, return an object with a single key
  // where the key is the prop name and the value is the single function
  if (typeof fnNames === 'string') {
    if (!validateFunction(fnNames, fnObject)) {
      return {}
    }

    return { [propName]: fnObject[fnNames] }
  }

  const fnList = fnNames.reduce((acc, fnName) => {
    if (!validateFunction(fnName, fnObject)) {
      return acc
    }

    let hookParams: unknown = {}
    if (fnName in props) {
      hookParams = props[fnName]
    }

    if (typeof fnObject[fnName] === 'object') {
      if (!hookParams) {
        return acc
      }
      const hook = (fnObject[fnName] as HookWithProps<object>).generator(hookParams)
      return [...acc, hook]
    }

    return [...acc, fnObject[fnName]]
  }, [] as object[])

  return fnList.length > 0 ? { [propName]: fnList } : {}
}

export { ResolveFunction }
