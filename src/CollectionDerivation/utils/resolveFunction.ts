import type { HookWithProps } from '../../types'
import { validateFunction } from '../FieldDerivation/validate'

/**
 * Resolves a function or list of functions to be used in a field definition
 * @param propName - The name of the prop to be resolved
 * @param fnObject - An object containing the functions to be resolved
 * @param fnNames - A string or list of strings containing the names of the functions to be resolved
 * @param props - An object containing the props to be passed to the resolved functions
 * @returns An object containing the resolved functions
 */
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

  // If there's a list of selected functions, return an object whose key
  // is a list of functions
  const fnList = fnNames.reduce((acc, fnName) => {
    // If the function name is not in the function object, return the accumulator
    if (!validateFunction(fnName, fnObject)) {
      return acc
    }

    // If the function is a hook with props, resolve the props and generate the hook
    if (typeof fnObject[fnName] === 'object') {
      let hookProps: unknown = {}
      if (fnName in props) {
        hookProps = props[fnName]
      }

      // If there are no props to resolve, return the accumulator
      if (!hookProps) {
        return acc
      }

      // Otherwise, resolve the props and generate the hook
      const hook = (fnObject[fnName] as HookWithProps<object>).generator(hookProps)
      return [...acc, hook]
    }

    // If the function is not a hook with props, return the function
    return [...acc, fnObject[fnName]]
  }, [] as object[])

  return fnList.length > 0 ? { [propName]: fnList } : {}
}

export { ResolveFunction }
