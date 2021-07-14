import React from 'react'
import ReactDOM from 'react-dom'

import { Img, imgPool } from '@robot-img/react-img'
import { checkWebpSupported, createSrcTplOfAliOss } from '@robot-img/utils'

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
      <div>
        <Img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
      </div>
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
