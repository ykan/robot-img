export type ImgRect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>

export type ImgEventType = 'scroll' | 'resize' | 'scroll+resize'

/**
 * src tpl 全局设置
 */
export interface ImgSrcTplGlobals {
  /** 是否使用 webp 格式的图片 */
  webp: boolean
  /** 设备像素比 */
  ratio: number
}

export interface ImgSrcTplFnArgs {
  /** 对应 dom 节点的 DOMRect */
  rect: DOMRect
  /** img.src */
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

/** 全局 srcTpl 工厂 */
export type ImgSrcTplFactoryResult = () => [ImgSrcTplRenderFn, ImgSrcTplGlobals]
export type ImgSrcTplFactory = (globalVars?: Partial<ImgSrcTplGlobals>) => ImgSrcTplFactoryResult

export interface ImgPoolGlobals {
  /** 全局默认图片 */
  defaultSrc?: string
  /** 图片加载出错时的全局默认设置图片 */
  errorSrc?: string
  /** 默认加载设置 */
  loadingType?: 'src' | 'css'
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
  getContainerRect?: (rect: DOMRect) => ImgRect
  /** 心跳间隔时间，单位 ms */
  tickTime?: number
  /** 全局的 srcTpl 设置 */
  createSrcTpl?: ImgSrcTplFactoryResult
  /** 一些全局变量 */
  globalVars?: ImgPoolGlobals
  /** 名字，用于一些问题的排查 */
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
  readonly isOverlapWindow: boolean

  /** src 模板 */
  srcTpl: ImgSrcTpl

  /** 判断图片所在矩形区域与容器区域是否有重叠 */
  overlap: (rect: ImgRect) => boolean

  /** 重置 */
  reset: (opts: ImgPoolOptions) => void

  /** 初始化 */
  init: () => void

  /** 销毁 */
  destroy: () => void

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
  onChecked: (event: ImgEventType) => void

  /** 每次心跳时执行 */
  onUpdate?: () => void
}

// snowpack bug
export const _SNOWPACK_ = true

// 手写的 ts 类型，用于 ts 类型打包优化
/**
 *
 */
export declare const createImgPool: (opts?: ImgPoolOptions, autoTick?: boolean) => ImgPool

/**
 * 检测是否可用 webp 格式
 * 正常耗时，低于 1ms
 */
export declare const checkWebpSupported: () => Promise<boolean>

/**
 * 等待图片加载完成
 * @param imgSrc 图片地址
 * @param crossOrigin 参考：https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image
 * @returns Promise<HTMLImageElement>
 */
export declare const waitImgLoaded: (
  imgSrc: string,
  crossOrigin?: 'anonymous' | 'use-credentials' | ''
) => Promise<HTMLImageElement>

/**
 * 利用阿里云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://help.aliyun.com/document_detail/44688.html
 * @param globalVars
 * @returns
 */
export declare const createSrcTplOfAliOss: ImgSrcTplFactory

/**
 * 利用金山云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://docs.ksyun.com/documents/886
 * @param globalVars
 * @returns
 */
export declare const createSrcTplOfKSYunKS3: ImgSrcTplFactory

/**
 * 利用七牛云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://developer.qiniu.com/dora/1279/basic-processing-images-imageview2
 * @param globalVars
 * @returns
 */
export declare const createSrcTplOfQiniu: ImgSrcTplFactory

/**
 * 利用腾讯云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://cloud.tencent.com/document/product/460/36541
 * @param globalVars
 * @returns
 */
export declare const createSrcTplOfTencent: ImgSrcTplFactory

/**
 * 创建不同云厂商的图片后缀处理函数
 * @param (gVars: ImgSrcTplGlobals) => ImgSrcTplRenderFn
 * @returns
 */
export declare const createSrcTplFactory: (
  factory: (gVars: ImgSrcTplGlobals) => ImgSrcTplRenderFn
) => ImgSrcTplFactory
