import React from 'react'

import { createImgPool } from '@robot-img/utils'

import { useForkRef } from './useForkRef'

import type { ImgContainerProps } from './types'

export function useImgContainer(props: ImgContainerProps, ref: React.Ref<HTMLDivElement>) {
  const { getContainerRect, tickTime, createSrcTpl, globalVars, name, ...domProps } = props
  const containerRef = React.useRef<HTMLDivElement>(null)
  const handleRef = useForkRef(containerRef, ref)
  const pool = React.useMemo(() => createImgPool(), [])
  // 值变更通过 reset 来设置
  React.useMemo(() => {
    pool.reset({ getContainerRect })
  }, [getContainerRect, pool])
  React.useMemo(() => {
    pool.reset({ tickTime })
  }, [tickTime, pool])
  React.useMemo(() => {
    pool.reset({ createSrcTpl })
  }, [createSrcTpl, pool])
  React.useMemo(() => {
    pool.reset({ globalVars })
  }, [globalVars, pool])
  React.useMemo(() => {
    pool.reset({ name })
  }, [name, pool])
  React.useEffect(() => {
    if (containerRef.current) {
      pool.reset({
        container: containerRef.current,
      })
    }
  }, [pool])
  return {
    handleRef,
    domProps,
    pool,
  }
}
