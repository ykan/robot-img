import React from 'react'
import ReactDOM from 'react-dom'

import styled from '@emotion/styled'
import {
  checkWebpSupported,
  createImgPool,
  createSrcTplFactory,
  createSrcTplOfAliOss,
  createSrcTplOfKSYunKS3,
  createSrcTplOfQiniu,
  createSrcTplOfTencent,
  Img,
  ImgPoolContext,
} from '@robot-img/react-img'

const Container = styled.div`
  .cloud-img {
    width: 100px;
    height: 80px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
`

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()
  // 阿里云，参考：https://help.aliyun.com/document_detail/44688.html
  const imgPoolAliOss = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  // 金山云，详见：https://docs.ksyun.com/documents/886
  const imgPoolK3S = createImgPool({
    createSrcTpl: createSrcTplOfKSYunKS3({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  // 七牛，详见：https://developer.qiniu.com/dora/1279/basic-processing-images-imageview2
  const imgPoolQiniu = createImgPool({
    createSrcTpl: createSrcTplOfQiniu({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  // 腾讯云，详见：https://cloud.tencent.com/document/product/460/36541
  const imgPoolTencent = createImgPool({
    createSrcTpl: createSrcTplOfTencent({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  // 自定义，以腾讯云为基础，比如自定义 webp 格式的质量
  const createCustomSrcTpl = createSrcTplFactory((globalVars) => ({ rect, src }) => {
    const configs: string[] = []
    if (rect.width && rect.height) {
      const w = Math.floor(globalVars.ratio * rect.width)
      const h = Math.floor(globalVars.ratio * rect.height)
      configs.push(`1/w/${w}/h/${h}`)
    }
    if (globalVars.webp) {
      configs.push('format/webp/quality/90')
    }
    if (configs.length < 1) {
      return src
    }

    return `${src}?imageView2/${configs.join('/')}`
  })
  const imgPoolCustom = createImgPool({
    createSrcTpl: createCustomSrcTpl({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  ReactDOM.render(
    <Container>
      <ImgPoolContext.Provider value={imgPoolAliOss}>
        <Img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
      </ImgPoolContext.Provider>
      <ImgPoolContext.Provider value={imgPoolK3S}>
        <Img src="//ks3-cn-beijing.ksyun.com/ks3-resources/suiyi.jpg" />
      </ImgPoolContext.Provider>
      <ImgPoolContext.Provider value={imgPoolQiniu}>
        <Img src="//7xp4qu.com2.z0.glb.qiniucdn.com/STglr2/avatar/0.jpg" />
      </ImgPoolContext.Provider>
      <ImgPoolContext.Provider value={imgPoolTencent}>
        <Img src="//examples-1251000004.cos.ap-shanghai.myqcloud.com/sample.jpeg" />
      </ImgPoolContext.Provider>
      <ImgPoolContext.Provider value={imgPoolCustom}>
        <Img src="//examples-1251000004.cos.ap-shanghai.myqcloud.com/sample.jpeg" />
      </ImgPoolContext.Provider>
    </Container>,
    document.getElementById('40-cloud')
  )
}

main()
