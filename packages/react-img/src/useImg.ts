import React from 'react'

import { ImgItem } from '@robot-img/utils'

import { ImgPoolContext } from './ImgPoolContext'
import { ImgProps } from './types'
import { useForkRef } from './useForkRef'

export function useImg<T extends HTMLElement>(props: ImgProps<T>, ref: React.Ref<T>) {
  const { src, srcTpl, defaultSrc, directly = false, ...others } = props
  const imgPool = React.useContext(ImgPoolContext)
  const imgRef = React.useRef<T>(null)
  const imgItemRef = React.useRef<ImgItem>({
    shouldCheck: false,
    checkType: 'scroll',
    onChecked: async () => {},
  })
  const poolRef = React.useRef(imgPool)
  const imgSrcTplFn = React.useMemo(() => {
    return poolRef.current.srcTpl(srcTpl)
  }, [srcTpl])

  const [imgSrc, setImgSrc] = React.useState('')

  React.useEffect(() => {
    // 当 context 变了，更新 pool
    if (poolRef.current !== imgPool) {
      poolRef.current.imgs.delete(imgItemRef.current)
      poolRef.current = imgPool
    }
    poolRef.current.imgs.add(imgItemRef.current)
    return () => {
      poolRef.current.imgs.delete(imgItemRef.current)
    }
  }, [imgPool])

  const handleRef = useForkRef(ref, imgRef)
  React.useEffect(() => {
    // 如果 src 不存在，则不处理
    if (!src) {
      return
    }
    if (imgRef.current && directly) {
      const rect = imgRef.current.getBoundingClientRect()
      const newSrc = imgSrcTplFn({ rect, src })
      setImgSrc(newSrc)
    } else if (imgRef.current && !directly) {
      imgItemRef.current.shouldCheck = true
      imgItemRef.current.onChecked = async () => {
        imgItemRef.current.shouldCheck = false
        if (!imgRef.current) {
          return
        }
        const rect = imgRef.current.getBoundingClientRect()
        if (poolRef.current.overlap(rect)) {
          const newSrc = imgSrcTplFn({ rect, src })
          setImgSrc(newSrc)
        } else {
          imgItemRef.current.shouldCheck = true
        }
      }
    } else if (src) {
      setImgSrc(src)
    }
  }, [directly, imgSrcTplFn, src])

  return {
    imgSrc,

    others,
    handleRef,
  }
}
