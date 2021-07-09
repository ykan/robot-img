export type ImgRect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>

export type ImgEventType = 'scroll' | 'resize' | 'scroll+resize'
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

export interface ImgPoolGlobals {
  /** 全局默认图片 */
  defaultImgSrc?: string
  /** 图片加载出错时的全局默认设置图片 */
  defaultErrorImgSrc?: string
  /** 全局样式名 */
  className?: string
  /** 图片不同状态下的样式名前缀 */
  statusClassNamePrefix?: string
  [key: string]: string | undefined
}

export interface ImgPoolOptions {
  /** 容器节点，也可以是 window */
  container?: Window | HTMLElement
  /** 设置需要检测的容器区域 */
  containerRectFn?: (rect: DOMRect) => ImgRect
  tickTime?: number
  srcTpl?: ImgSrcTplRenderFn
  srcTplGlobalVars?: ImgSrcTplGlobals
  globalVars?: ImgPoolGlobals
  name?: string
}

export interface ImgPool {
  readonly imgs: Set<ImgItem>
  readonly currentEventType: ImgEventType | 'none'
  readonly containerRect: ImgRect
  readonly tickTime: number
  readonly container: Window | HTMLElement
  readonly globalVars: ImgPoolGlobals
  readonly name: string

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
  checkImgs: (eventType: ImgEventType, done?: () => void) => void

  /** 发生了某个事件 */
  occur: (type: ImgEventType) => void

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

  /** 触发检测时调用 */
  onChecked: (event: ImgEventType) => Promise<void>
}
