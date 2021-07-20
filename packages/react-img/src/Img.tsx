import React from 'react'

import { createImgPool } from '@robot-img/utils'

import { ImgPoolContext } from './ImgPoolContext'
import { useForkRef } from './useForkRef'
import { useImg, useImgWithStyle } from './useImg'

import type { ImgProps, ImgContainerProps } from './types'

function withProperties<A, B>(component: A, properties: B): A & B {
  Object.keys(properties).forEach((key) => {
    ;(component as any)[key] = (properties as any)[key]
  })
  return component as A & B
}

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

export const ImgDiv = React.forwardRef<HTMLDivElement, ImgProps<HTMLDivElement>>((props, ref) => {
  const { handleRef, domProps } = useImgWithStyle(props, ref)
  return <div {...domProps} ref={handleRef} />
})

export const ImgSpan = React.forwardRef<HTMLSpanElement, ImgProps<HTMLSpanElement>>(
  (props, ref) => {
    const { handleRef, domProps } = useImgWithStyle(props, ref)
    return <span {...domProps} ref={handleRef} />
  }
)

const ImgComponent = React.forwardRef<HTMLImageElement, ImgProps<HTMLImageElement>>(
  (props, ref) => {
    const { handleRef, defaultSrc, state, domProps, crossOrigin } = useImg(props, ref)
    return (
      <img {...domProps} crossOrigin={crossOrigin} src={state.src || defaultSrc} ref={handleRef} />
    )
  }
)

export const Img = withProperties(ImgComponent, {
  Div: ImgDiv,
  Span: ImgSpan,
  Container: ImgContainer,
})
