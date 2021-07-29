import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import {
  checkWebpSupported,
  createImgPool,
  createSrcTplOfAliOss,
  Img,
  ImgPoolContext,
} from '@robot-img/react-img'

const Container = styled.div`
  .div {
    width: 300px;
    height: 240px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    width: 160px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.5);
    text-align: center;
    line-height: 80px;
    padding: 10px;
  }
  .span {
    width: 50px;
    height: 30px;
    margin-right: 10px;
  }
  .img {
    width: 50px;
    height: 30px;
  }
`

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()
  // 还是以阿里云为例
  const imgPool = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
    globalVars: {
      className: 'css-style-img',
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
   * span.${globalVars.className} {
   *  display: inline-block;
   * }
   * ```
   */
  imgPool.appendDefaultStyle()
  const imgSrc = '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg'
  // 真实加载的图片为： ${imgSrc}?x-oss-process=image/resize,m_fill,w_400,h_320/format,webp
  ReactDOM.render(
    <Container>
      <ImgPoolContext.Provider value={imgPool}>
        <Img.Div src={imgSrc} className="div">
          <div className="content">
            <Img.Span src={imgSrc} className="span" />
            <Img src={imgSrc} className="img" />
          </div>
        </Img.Div>
      </ImgPoolContext.Provider>
    </Container>,
    document.getElementById('30-css')
  )
}

main()
