import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import {
  checkWebpSupportedSync,
  createImgPool,
  createSrcTplOfAliOss,
  Img,
  ImgPoolContext,
  waitImgLoaded,
} from '@robot-img/react-img'

const Container = styled.div`
  .ali-oss-img {
    width: 200px;
    height: 160px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: background-image 0.3s;
    border: 1px solid #ccc;

    &-loading {
      border-color: blue;
      background-size: 64px 64px;
    }
    &-loaded {
      border-color: green;
    }
    &-error {
      border-color: red;
      background-size: 64px 64px;
    }
  }
  button {
    margin-top: 10px;
    margin-right: 10px;
    user-select: none;
  }
`

function Demo() {
  const resolve = React.useRef<(args?: any) => void>(() => {})
  const reject = React.useRef<(args?: any) => void>(() => {})
  const wait = React.useCallback(
    () =>
      new Promise((r, rj) => {
        resolve.current = r
        reject.current = rj
      }),
    []
  )
  const prepareImg: typeof waitImgLoaded = React.useMemo(() => {
    return async (imgSrc, crossOrigin) => {
      const img = await waitImgLoaded(imgSrc, crossOrigin)
      await wait()
      return img
    }
  }, [wait])
  const handleResolve = React.useCallback(() => {
    resolve.current()
  }, [])
  const handleReject = React.useCallback(() => {
    reject.current()
  }, [])
  const [src, setSrc] = React.useState('')
  const handleSrc = React.useCallback(() => {
    setSrc('//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg')
  }, [])
  const handleClear = React.useCallback(() => {
    setSrc('')
  }, [])
  return (
    <div>
      <Img.Div src={src} prepareImg={prepareImg} />
      <button onClick={src ? handleClear : handleSrc}>{src ? 'Clear img' : 'Load img'}</button>
      <button onClick={handleResolve}>Mock success</button>
      <button onClick={handleReject}>Mock reject</button>
    </div>
  )
}

async function main() {
  // 阿里云，参考：https://help.aliyun.com/document_detail/44688.html
  const imgPoolAliOss = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp: checkWebpSupportedSync(),
    }),
    globalVars: {
      className: 'ali-oss-img',
      statusClassNamePrefix: 'ali-oss-img-',
      defaultSrc: './imgs/picture.png',
      errorSrc: './imgs/error.png',
      loadingType: 'src',
    },
  })

  ReactDOM.render(
    <Container>
      <ImgPoolContext.Provider value={imgPoolAliOss}>
        <Demo />
      </ImgPoolContext.Provider>
    </Container>,
    document.getElementById('70-globals')
  )
}

main()
