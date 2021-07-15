import React from 'react'

import { useImg, useImgWithStyle } from './useImg'

import type { ImgProps } from './types'

function withProperties<A, B>(component: A, properties: B): A & B {
  Object.keys(properties).forEach((key) => {
    ;(component as any)[key] = (properties as any)[key]
  })
  return component as A & B
}

export const ImgDiv = React.forwardRef<HTMLDivElement, ImgProps<HTMLDivElement>>((props, ref) => {
  const { handleRef, style, className, others } = useImgWithStyle(props, ref)
  return <div {...others} className={className} style={style} ref={handleRef} />
})

export const ImgSpan = React.forwardRef<HTMLSpanElement, ImgProps<HTMLSpanElement>>(
  (props, ref) => {
    const { handleRef, style, className, others } = useImgWithStyle(props, ref)
    return <span {...others} className={className} style={style} ref={handleRef} />
  }
)

const ImgComponent = React.forwardRef<HTMLImageElement, ImgProps<HTMLImageElement>>(
  (props, ref) => {
    const { handleRef, crossOrigin, defaultSrc, className, state, others } = useImg(props, ref)
    return (
      <img
        {...others}
        src={state.src || defaultSrc}
        className={className}
        crossOrigin={crossOrigin}
        ref={handleRef}
      />
    )
  }
)

export const Img = withProperties(ImgComponent, {
  Div: ImgDiv,
  Span: ImgSpan,
})
