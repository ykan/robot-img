import { ImgPoolOptions, ImgSrcTpl, ImgSrcTplGlobals, ImgSrcTplRenderFn } from './types'
import { checkWebp } from './utils'

export function createAliOssRenderFn(globalVars: ImgSrcTplGlobals): ImgSrcTplRenderFn {
  return ({ src, rect }) => {
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
  }
}

export function createSrcTpl(
  globalSrcTpl?: ImgPoolOptions['srcTpl'],
  globalVars?: ImgSrcTplGlobals
): ImgSrcTpl {
  const innerGlobalVars: ImgSrcTplGlobals = globalVars || {
    webp: false,
    ratio: window.devicePixelRatio || 1,
  }
  if (!globalVars || (globalVars && !('webp' in globalVars))) {
    // 正常这个函数会在 1ms 内执行完，而心跳的间隔不会那么快
    // 如果有更好的办法再改
    /* istanbul ignore next */
    checkWebp().then((supported) => {
      innerGlobalVars.webp = supported
    })
  }

  let defaultSrcTpl: ImgSrcTplRenderFn = (attrs) => attrs.src

  if (globalSrcTpl === 'ali-oss') {
    defaultSrcTpl = createAliOssRenderFn(innerGlobalVars)
  } else if (typeof globalSrcTpl === 'function') {
    defaultSrcTpl = globalSrcTpl
  }

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
