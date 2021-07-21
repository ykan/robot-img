import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import { Img, ImgContainer, imgPool } from '@robot-img/react-img'
import { checkWebpSupported, createSrcTplOfAliOss } from '@robot-img/utils'

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 10px;

  .robot-img {
    width: 40vw;
    height: 30vw;
    background-size: cover;
    margin-bottom: 150vh;
  }
  .container {
    height: 300px;
    overflow: scroll;
  }
  .img {
    width: 50vw;
    height: 50vw;
    background-size: cover;
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
    <React.StrictMode>
      <Container>
        <Img.Div src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        <ImgContainer className="container">
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
      </Container>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

main()
