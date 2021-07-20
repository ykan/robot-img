import React from 'react'

import { ImgPoolContext } from './ImgPoolContext'
import { useImg, useImgWithStyle } from './useImg'
import { useImgContainer } from './useImgContainer'

import type { ImgProps, ImgContainerProps } from './types'
function withProperties<A, B>(component: A, properties: B): A & B {
  Object.keys(properties).forEach((key) => {
    ;(component as any)[key] = (properties as any)[key]
  })
  return component as A & B
}

export const ImgContainer = React.forwardRef<HTMLDivElement, ImgContainerProps>((props, ref) => {
  const { domProps, handleRef, pool } = useImgContainer(props, ref)
  return (
    <ImgPoolContext.Provider value={pool}>
      <div {...domProps} ref={handleRef} />
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
