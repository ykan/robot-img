import React from 'react'

import { useImg, useImgWithStyle } from './useImg'

import type { ImgProps } from './types'
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

export const Img = React.forwardRef<HTMLImageElement, ImgProps<HTMLImageElement>>((props, ref) => {
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
})
