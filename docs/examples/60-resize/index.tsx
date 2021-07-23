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

const Container = styled.div`
  .robot-img {
    background-size: cover;
    background-position: center;
    transition: background-image 0.3s;
    margin-bottom: 20px;
  }
  button {
    margin-right: 10px;
    user-select: none;
  }
`

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
  return (
    <div>
      <StyledImg {...domProps} $src={state.src} ref={handleRef} />
      <p>当前的 src: ${state.src}</p>
    </div>
  )
})

function App() {
  const [ratio, setRatio] = React.useState(1)
  const handleAdd = React.useCallback(() => {
    setRatio((oldRatio) => Math.min(3, oldRatio * 1.05))
  }, [])
  const handleCut = React.useCallback(() => {
    setRatio((oldRatio) => oldRatio * 0.95)
  }, [])
  const imgStyle = React.useMemo(
    () => ({
      width: 100 * ratio,
      height: 60 * ratio,
    }),
    [ratio]
  )

  return (
    <Container>
      <Img
        style={imgStyle}
        lazy="resize"
        src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg"
      />
      <button onClick={handleAdd}>宽高变大10%</button>
      <button onClick={handleCut}>宽高变小10%</button>
    </Container>
  )
}

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
  ReactDOM.render(<App />, document.getElementById('60-resize'))
}

main()
