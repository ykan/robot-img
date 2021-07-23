import React from 'react'
import ReactDOM from 'react-dom'

import { Img } from '@robot-img/react-img'

function main() {
  const imgSrc = '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg'
  // 图片后缀不做任何处理
  ReactDOM.render(
    <Img src={imgSrc} style={{ width: 200 }} />,
    document.getElementById('20-default')
  )
}

main()
