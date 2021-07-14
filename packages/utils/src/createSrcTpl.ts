import type { ImgSrcTpl, ImgSrcTplFactory, ImgSrcTplFactoryResult } from './types'

const defaultGlobalVars = {
  webp: false,
  ratio: window.devicePixelRatio || 1,
}
const defaultGlobalSrcTpl: ImgSrcTplFactoryResult = () => [(attrs) => attrs.src, defaultGlobalVars]

export function createSrcTpl(
  globalSrcTpl: ImgSrcTplFactoryResult = defaultGlobalSrcTpl
): ImgSrcTpl {
  const [defaultSrcTpl, innerGlobalVars] = globalSrcTpl()

  return (srcTpl) => {
    if (typeof srcTpl === 'function') {
      return (attrs) => {
        const ratioWidth = Math.floor(innerGlobalVars.ratio * attrs.rect.width)
        const ratioHeight = Math.floor(innerGlobalVars.ratio * attrs.rect.height)
        return srcTpl({
          ...attrs,
          ...innerGlobalVars,
          ratioWidth,
          ratioHeight,
        })
      }
    }

    return defaultSrcTpl
  }
}

/**
 * 利用阿里云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://help.aliyun.com/document_detail/44688.html
 * @param globalVars
 * @returns
 */
export const createSrcTplOfAliOss: ImgSrcTplFactory =
  (globalVars = defaultGlobalVars) =>
  () =>
    [
      ({ src, rect }) => {
        const configs: string[] = []
        if (rect.width && rect.height) {
          const ratioW = Math.floor(globalVars.ratio * rect.width)
          const ratioH = Math.floor(globalVars.ratio * rect.height)
          // 阿里云最大支持 4096，详见：https://help.aliyun.com/document_detail/44688.html
          const w = Math.min(4096, ratioW)
          const h = Math.min(4096, ratioH)
          configs.push(`resize,m_fill,w_${w},h_${h}`)
        }
        if (globalVars.webp) {
          configs.push('format,webp')
        }
        if (configs.length < 1) {
          return src
        }

        return `${src}?x-oss-process=image/${configs.join('/')}`
      },
      globalVars,
    ]

/**
 * 利用金山云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://docs.ksyun.com/documents/886
 * @param globalVars
 * @returns
 */
export const createSrcTplOfKSYunKS3: ImgSrcTplFactory =
  (globalVars = defaultGlobalVars) =>
  () =>
    [
      ({ src, rect }) => {
        const configs: string[] = []
        if (rect.width && rect.height) {
          const ratioW = Math.floor(globalVars.ratio * rect.width)
          const ratioH = Math.floor(globalVars.ratio * rect.height)
          // 金山云最大支持 4096，详见：https://docs.ksyun.com/documents/886
          const w = Math.min(4096, ratioW)
          const h = Math.min(4096, ratioH)
          configs.push(`&m=1&c=1&w=${w}&h=${h}`)
        }
        if (globalVars.webp) {
          configs.push('&F=webp')
        }
        if (configs.length < 1) {
          return src
        }

        return `${src}@base@tag=imgScale${configs.join('')}`
      },
      globalVars,
    ]

/**
 * 利用七牛云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://developer.qiniu.com/dora/1279/basic-processing-images-imageview2
 * @param globalVars
 * @returns
 */
export const createSrcTplOfQiniu: ImgSrcTplFactory =
  (globalVars = defaultGlobalVars) =>
  () =>
    [
      ({ src, rect }) => {
        const configs: string[] = []
        if (rect.width && rect.height) {
          const w = Math.floor(globalVars.ratio * rect.width)
          const h = Math.floor(globalVars.ratio * rect.height)
          configs.push(`1/w/${w}/h/${h}`)
        }
        if (globalVars.webp) {
          configs.push('format/webp')
        }
        if (configs.length < 1) {
          return src
        }

        return `${src}?imageView2/${configs.join('/')}`
      },
      globalVars,
    ]

/**
 * 利用腾讯云的图片处理功能，使用合适的图片
 * 图片处理文档参考：https://cloud.tencent.com/document/product/460/36541
 * @param globalVars
 * @returns
 */
export const createSrcTplOfTencent: ImgSrcTplFactory =
  (globalVars = defaultGlobalVars) =>
  () =>
    [
      ({ src, rect }) => {
        const configs: string[] = []
        if (rect.width && rect.height) {
          const w = Math.floor(globalVars.ratio * rect.width)
          const h = Math.floor(globalVars.ratio * rect.height)
          configs.push(`crop/${w}x${h}`)
        }
        if (globalVars.webp) {
          configs.push('format/webp')
        }
        if (configs.length < 1) {
          return src
        }

        return `${src}?imageMogr2/${configs.join('/')}`
      },
      globalVars,
    ]
