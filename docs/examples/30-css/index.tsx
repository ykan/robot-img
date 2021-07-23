import React from 'react'
import ReactDOM from 'react-dom'

import {
  checkWebpSupported,
  createImgPool,
  createSrcTplOfAliOss,
  Img,
  ImgPoolContext,
} from '@robot-img/react-img'

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()
  // 还是以阿里云为例
  const imgPool = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
    globalVars: {
      className: 'custom-img',
    },
  })
  // 可以用这个方法加一个默认样式
  /**
   * 根据 globalVars.className 设置一个全局默认样式
   * 默认样式为：
   * ```
   * .${globalVars.className} {
   *  transition: background-image .3s;
   *  background-size: cover;
   *  background-position: center;
   *  background-repeat: no-repeat;
   * }
   * ```
   */
  imgPool.appendDefaultStyle()
  const imgSrc = '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg'
  // 真实加载的图片为： ${imgSrc}?x-oss-process=image/resize,m_fill,w_400,h_320/format,webp
  ReactDOM.render(
    <ImgPoolContext.Provider value={imgPool}>
      <Img src={imgSrc} style={{ width: 100 }} />
      <Img.Span src={imgSrc} style={{ width: 100, height: 80, display: 'inline-flex' }} />
      <Img.Div src={imgSrc} style={{ width: 100, height: 80 }} />
    </ImgPoolContext.Provider>,
    document.getElementById('30-css')
  )
}

main()
