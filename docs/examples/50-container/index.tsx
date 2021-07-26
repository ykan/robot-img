import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import { Img, ImgContainer, imgPool } from '@robot-img/react-img'
import { checkWebpSupported, createSrcTplOfAliOss } from '@robot-img/utils'

const Container = styled.div`
  .img-container {
    height: 300px;
    overflow: scroll;
  }
  .img {
    width: 200px;
    height: 160px;
    background-size: cover;
    margin-bottom: 10px;
  }
`

async function main() {
  const webp = await checkWebpSupported()
  imgPool.reset({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
    globalVars: {
      className: 'robot-img',
    },
  })
  ReactDOM.render(
    <Container>
      <ImgContainer
        className="img-container"
        createSrcTpl={createSrcTplOfAliOss({
          webp,
        })}
        globalVars={{ className: 'robot-img' }}
      >
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <Img.Div className="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
      </ImgContainer>
    </Container>,
    document.getElementById('50-container')
  )
}

main()
