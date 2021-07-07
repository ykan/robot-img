export type ImgRect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>

export type ImgCheckType = 'none' | 'scroll' | 'resize' | 'scroll+resize'
export interface ImgSrcTplGlobals {
  webp: boolean
  ratio: number
}

export interface ImgSrcTplFnArgs {
  rect: DOMRect
  src: string
}

export interface ImgSrcTplPropFnArgs extends ImgSrcTplGlobals, ImgSrcTplFnArgs {
  /** 返回按比例放大图片的 width */
  ratioWidth: number
  /** 返回按比例放大图片的 height */
  ratioHeight: number
}

/** 作为属性传递时的类型 */
export type ImgSrcTplPropFn = (attrs: ImgSrcTplPropFnArgs) => string
/** 执行检测时用的类型 */
export type ImgSrcTplRenderFn = (attrs: ImgSrcTplFnArgs) => string
/** 全局设置时的类型 */
export type ImgSrcTpl = (srcTpl?: ImgSrcTplPropFn) => ImgSrcTplRenderFn

export interface ImgPoolOptions {
  /** 容器节点，也可以是 window */
  container?: Window | HTMLElement
  containerRectFn?: (rect: DOMRect) => ImgRect
  tickTime?: number
  srcTpl?: ImgSrcTplRenderFn | 'ali-oss'
  globalVars?: ImgSrcTplGlobals
}

export interface ImgPool {
  readonly imgs: Set<ImgItem>
  readonly currentCheckType: ImgCheckType
  readonly containerRect: ImgRect
  readonly tickTime: number
  readonly container: Window | HTMLElement

  srcTpl: ImgSrcTpl

  /** 判断图片所在矩形区域与容器区域是否有重叠 */
  overlap: (rect: ImgRect) => boolean

  /** 重置 */
  reset: (opts: ImgPoolOptions) => void

  /** 初始化 */
  init: () => void

  /** 销毁 */
  destroy: () => void

  /** 执行一遍检测 */
  checkImgs: (done?: () => void) => void

  /** 发生了某个事件 */
  occur: (type: 'scroll' | 'resize') => void

  /** 心跳更新函数 */
  update: () => void

  /** 执行心跳 */
  tick: (isStart?: boolean) => void

  /** 停止心跳 */
  stopTick: () => void
}

export interface ImgItem {
  /** 当前实例是否需要检测 */
  shouldCheck: boolean
  /** 要检测的类型，比如 'scroll' 表示发生滚动则检测 */
  checkType: Omit<ImgCheckType, 'none'>
  /** 触发检测时调用 */
  onChecked: () => Promise<void>
}
