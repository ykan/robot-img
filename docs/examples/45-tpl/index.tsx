import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import {
  checkWebpSupportedSync,
  createImgPool,
  createSrcTplOfAliOss,
  Img,
  ImgPoolContext,
} from '@robot-img/react-img'

const Container = styled.div`
  .ali-oss-img {
    width: 200px;
    height: 160px;
    background-size: contain;
    background-color: #ccc;
    background-repeat: no-repeat;
    background-position: center;
    transition: background-image 0.3s;
  }
`

function main() {
  // 阿里云，参考：https://help.aliyun.com/document_detail/44688.html
  const imgPoolAliOss = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp: checkWebpSupportedSync(),
    }),
    globalVars: {
      className: 'ali-oss-img',
    },
  })

  ReactDOM.render(
    <Container>
      <ImgPoolContext.Provider value={imgPoolAliOss}>
        <Img.Div
          src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg"
          srcTpl={({ src, ratioWidth, ratioHeight, webp }) =>
            `${src}?x-oss-process=image/resize,m_lfit,w_${ratioWidth},h_${ratioHeight}${
              webp ? '/format,webp' : ''
            }/blur,r_3,s_2`
          }
        />
      </ImgPoolContext.Provider>
    </Container>,
    document.getElementById('45-tpl')
  )
}

main()
