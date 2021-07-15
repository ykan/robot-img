import type React from 'react'

import type { ImgSrcTplPropFn } from '@robot-img/utils'

export interface ImgState {
  /** 真实使用的 src */
  src: string
  /** 未处理前的 src */
  originSrc: string
  /**
   * 当前状态
   */
  status: 'blank' | 'loading' | 'error' | 'loaded'
  /** 图片节点的 DOMRect */
  rect?: DOMRect
}

export interface ImgPureProps {
  /** 图片地址 */
  src?: string

  /**
   * 图片默认地址
   * @default imgPool.globalVars.defaultSrc 如果不设置取全局默认值
   */
  defaultSrc?: string
  /**
   * 出错的时候的图片地址
   * @default imgPool.globalVars.errorSrc 如果不设置取全局默认值
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

  /**
   * 设置图片为异步加载
   * 这个时候，useImg 返回的 state.status 可能会 blank -> loading -> loaded 或者 blank -> loading -> error
   * 当 loadingType === 'src' 时，状态会体现在 state.src 上，
   *    - state.status === 'loading' 使用 defaultSrc
   *    - state.status === 'error' 使用 errorSrc
   * 当 loadingType === 'css' 时，
   *    - state.status === 'loading' ， state.src = ''
   *    - state.status === 'error'  ， state.src = ''
   * 此时需要根据不同状态下的样式来体现
   * @default imgPool.globalVars.loadingType 如果不设置取全局默认值
   */
  loadingType?: 'src' | 'css'

  /**
   * 注意当 loadingType 存在时，该属性才会生效
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | ''
  /**
   * 加载失败时调用
   * 注意当 loadingType 存在时，该属性才会生效
   */
  onError?: (e: string | Event) => void
  /**
   * 加载成功时调用
   * 注意当 loadingType 存在时，该属性才会生效
   */
  onLoaded?: (img: HTMLImageElement) => void
}

type OmitPropsDefault = 'crossOrigin' | 'onError' | 'onLoaded'

export type ImgProps<T extends HTMLElement = HTMLElement> = ImgPureProps &
  Omit<React.HTMLAttributes<T>, OmitPropsDefault>

// snowpack bug
const _SNOWPACK_ = true
