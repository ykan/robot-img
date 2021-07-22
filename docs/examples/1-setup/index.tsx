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

const StyledImg = styled.div<{ $src: string }>`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.3s;
  ${(props) => props.$src && `background-image: url(${props.$src});`}
`

const Img = React.forwardRef<HTMLDivElement, ImgProps<HTMLDivElement>>((props, ref) => {
  const { domProps, state, handleRef } = useImg(props, ref)
  return <StyledImg {...domProps} $src={state.src} ref={handleRef} />
})

const OssImg = styled(Img)`
  width: 200px;
  height: 160px;
`

async function main() {
  const webp = await checkWebpSupported()
  imgPool.reset({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
  })
  ReactDOM.render(
    <React.StrictMode>
      <div className="container">
        <OssImg src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
      </div>
    </React.StrictMode>,
    document.getElementById('1-setup')
  )
}

main()
