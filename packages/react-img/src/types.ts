import React from 'react'

import { ImgSrcTplPropFn } from '@robot-img/utils'

export interface ImgPureProps {
  src?: string

  defaultSrc?: string

  srcTpl?: ImgSrcTplPropFn

  directly?: boolean
}

type OmitPropsDefault = 'onError' | 'onLoaded' | 'width' | 'height'

export type ImgProps<T extends HTMLElement = HTMLElement> = ImgPureProps &
  Omit<React.HTMLAttributes<T>, OmitPropsDefault>
