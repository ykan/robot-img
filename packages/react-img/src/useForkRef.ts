import React from 'react'

/**
 * copy from: https://github.com/mui-org/material-ui/blob/1e31878744e0816763f4de7e2c63f42f23859148/packages/material-ui-utils/src/setRef.ts
 */
function setRef<T>(
  ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null
): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

export function useForkRef<T>(refA: React.Ref<T>, refB: React.Ref<T>) {
  /**
   * This will create a new function if the ref props change and are defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior
   */
  return React.useMemo(() => {
    if (!refA && !refB) {
      return null
    }
    return (refValue: T) => {
      setRef(refA, refValue)
      setRef(refB, refValue)
    }
  }, [refA, refB])
}
