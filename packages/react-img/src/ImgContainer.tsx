import React from 'react'

import { createImgPool } from '@robot-img/utils'

import { ImgPoolContext } from './ImgPoolContext'
import { useForkRef } from './useForkRef'

import type { ImgContainerProps } from './types'
export const ImgContainer = React.forwardRef<HTMLDivElement, ImgContainerProps>((props, ref) => {
  const { getContainerRect, tickTime, createSrcTpl, globalVars, name, ...others } = props
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
  return (
    <ImgPoolContext.Provider value={pool}>
      <div {...others} ref={handleRef} />
    </ImgPoolContext.Provider>
  )
})
