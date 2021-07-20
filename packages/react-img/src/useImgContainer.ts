import React from 'react'

import { createImgPool } from '@robot-img/utils'

import { useForkRef } from './useForkRef'

import type { ImgContainerProps } from './types'

export function useImgContainer(props: ImgContainerProps, ref: React.Ref<HTMLDivElement>) {
  const { getContainerRect, tickTime, createSrcTpl, globalVars, name, ...domProps } = props
  const containerRef = React.useRef<HTMLDivElement>(null)
  const handleRef = useForkRef(containerRef, ref)
  const pool = React.useMemo(() => createImgPool(), [])
  React.useEffect(() => {
    if (containerRef.current) {
      pool.reset({
        container: containerRef.current,
        getContainerRect,
        tickTime,
        createSrcTpl,
        globalVars,
        name,
      })
    }
  }, [createSrcTpl, getContainerRect, globalVars, name, pool, tickTime])
  return {
    handleRef,
    domProps,
    pool,
  }
}
