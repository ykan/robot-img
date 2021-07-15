import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import { Img, imgPool } from '@robot-img/react-img'
import { checkWebpSupported, createSrcTplOfAliOss } from '@robot-img/utils'

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`

const ExampleImg = styled(Img.Div)`
  width: 100px;
  height: 60px;
  background-size: cover;
`

async function main() {
  const webp = await checkWebpSupported()
  imgPool.reset({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
      ratio: window.devicePixelRatio || 1,
    }),
  })
  ReactDOM.render(
    <React.StrictMode>
      <Container>
        <ExampleImg src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
      </Container>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

main()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
