import React from 'react'

import { ImgSrcTplPropFn } from '@robot-img/utils'

export interface ImgState {
  src: string
  originSrc: string
  rect?: DOMRect
  status: 'blank' | 'loading' | 'error' | 'loaded'
}

export interface ImgPureProps {
  /** 图片地址 */
  src?: string

  /**
   * 图片默认地址
   * 默认值也可以通过 ImgPoolContext 来设置
   */
  defaultSrc?: string
  /**
   * 出错的时候的图片地址
   */
  errorSrc?: string

  /**
   * 可以单个组件自定义，比如
   * ```
   * <RobotImg srcTpl={(attrs) => `${attrs.src}?some_img_params_w=${artts.ratioWidth}`} />
   * ```
   */
  srcTpl?: ImgSrcTplPropFn

  /** 图片不同状态下的样式名前缀 */
  statusClassNamePrefix?: string

  /**
   * 懒加载模式
   * @default 'scroll' 默认检测滚动
   */
  lazy?: false | 'scroll' | 'resize'

  loadingType?: 'default'

  crossOrigin?: 'anonymous' | 'use-credentials' | ''

  onError?: () => void

  onLoaded?: (img: HTMLImageElement) => void
}

type OmitPropsDefault = 'crossOrigin' | 'onError' | 'onLoaded'

export type ImgProps<T extends HTMLElement = HTMLElement> = ImgPureProps &
  Omit<React.HTMLAttributes<T>, OmitPropsDefault>
