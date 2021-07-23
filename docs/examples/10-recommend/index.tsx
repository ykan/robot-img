import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import {
  checkWebpSupported,
  createSrcTplOfAliOss,
  imgPool,
  ImgProps,
  useImg,
} from '@robot-img/react-img'

// 设置图片组件样式
const StyledImg = styled.div<{ $src: string }>`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.3s;
  ${(props) => props.$src && `background-image: url(${props.$src});`}
`

// 使用 useImg 自定义组件
const Img = React.forwardRef<HTMLDivElement, ImgProps<HTMLDivElement>>((props, ref) => {
  const { domProps, state, handleRef } = useImg(props, ref)
  return <StyledImg {...domProps} $src={state.src} ref={handleRef} />
})

// 具体使用时，设置对应的样式
const OssImg = styled(Img)`
  width: 200px;
  height: 160px;
`

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()
  // 根据云厂商来设置全局图片后缀，获取最适合的图片
  // 这里使用的阿里云的图片处理作为案例
  imgPool.reset({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
  })
  const imgSrc = '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg'
  // 真实加载的图片为： ${imgSrc}?x-oss-process=image/resize,m_fill,w_400,h_320/format,webp
  ReactDOM.render(<OssImg src={imgSrc} />, document.getElementById('10-recommend'))
}

main()
