import React from 'react'

import { ImgProps } from './types'
import { useImg } from './useImg'

const Img = React.forwardRef<HTMLDivElement, ImgProps<HTMLDivElement>>((props, ref) => {
  const { handleRef, others } = useImg(props, ref)
  return <div {...others} ref={handleRef} />
})

export const ImgDiv = React.memo(Img)
