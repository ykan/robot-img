import { ImgPoolOptions, ImgSrcTpl, ImgSrcTplGlobals, ImgSrcTplRenderFn } from './types'

export function createSrcTplOfAliOss(globalVars: ImgSrcTplGlobals): ImgSrcTplRenderFn {
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
