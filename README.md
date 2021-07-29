# Robot Img

[![npm](https://img.shields.io/npm/v/@robot-img/react-img)](https://www.npmjs.com/package/@robot-img/react-img)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/ykan/robot-img/branch/main/graph/badge.svg?token=16W86248CN)](https://codecov.io/gh/ykan/robot-img)
[![Test Report](https://github.com/ykan/robot-img/actions/workflows/ci.yml/badge.svg)](https://github.com/ykan/robot-img/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/47314d52-98d0-4796-a340-632754b097a1/deploy-status)](https://app.netlify.com/sites/robot-img/deploys)

一个好用的图片 React 组件，可以实现图片懒加载、适配云厂商的图片处理功能。

`npm` 安装：

```bash
~ npm install @robot-img/react-img
```
## 使用说明

如果你使用的是 [Emotion](https://emotion.sh/docs/introduction) 或是 [styled-components](https://styled-components.com/) ，推荐使用以下配置方式：

```tsx
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
```

更多案例详见：[https://robot-img.netlify.app/](https://robot-img.netlify.app/)
