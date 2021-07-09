import { ImgPoolOptions, ImgSrcTpl, ImgSrcTplGlobals, ImgSrcTplRenderFn } from './types'

export function createSrcTpl(
  globalSrcTpl?: ImgPoolOptions['srcTpl'],
  globalVars?: ImgSrcTplGlobals
): ImgSrcTpl {
  const innerGlobalVars: ImgSrcTplGlobals = globalVars || {
    webp: false,
    ratio: window.devicePixelRatio || 1,
  }

  const defaultSrcTpl: ImgSrcTplRenderFn = globalSrcTpl || ((attrs) => attrs.src)

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
