import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import { Img, imgPool } from '@robot-img/react-img'
import { checkWebpSupported, createSrcTplOfAliOss } from '@robot-img/utils'

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 10px;

  .robot-img {
    width: 400px;
    height: 320px;
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
      </Container>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

main()
