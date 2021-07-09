import React from 'react'

import { ImgItem, waitImgLoaded } from '@robot-img/utils'

import { ImgPoolContext } from './ImgPoolContext'
import { ImgProps, ImgState } from './types'
import { useForkRef } from './useForkRef'

export function useImg<T extends HTMLElement>(props: ImgProps<T>, ref: React.Ref<T>) {
  const {
    src = '',
    srcTpl,
    defaultSrc,
    errorSrc,
    lazy = 'scroll',
    className,
    statusClassNamePrefix,
    loadingType,
    crossOrigin,
    onError,
    onLoaded,
    ...others
  } = props
  const imgRef = React.useRef<T>(null)
  const handleRef = useForkRef(ref, imgRef)
  // 要保障整个生命周期只有一个引用
  const imgItemRef = React.useRef<ImgItem>({
    shouldCheck: false,
    onChecked: async () => {},
  })
  const imgPool = React.useContext(ImgPoolContext)
  const poolRef = React.useRef(imgPool)
  // 当 context 变了，更新 pool
  if (poolRef.current !== imgPool) {
    poolRef.current.imgs.delete(imgItemRef.current)
    poolRef.current = imgPool
    poolRef.current.imgs.add(imgItemRef.current)
  }
  const imgSrcTplFn = React.useMemo(() => {
    return imgPool.srcTpl(srcTpl)
  }, [srcTpl, imgPool])
  const finalDefaultSrc = React.useMemo(
    () => defaultSrc || poolRef.current.globalVars.defaultImgSrc || '',
    [defaultSrc]
  )
  const finalErrorSrc = React.useMemo(
    () => errorSrc || poolRef.current.globalVars.defaultErrorImgSrc || '',
    [errorSrc]
  )

  const [state, setState] = React.useState<ImgState>({
    src: '',
    originSrc: '',
    status: 'blank',
  })

  const finalClassName = React.useMemo(() => {
    const statusPrefix = statusClassNamePrefix || imgPool.globalVars.statusClassNamePrefix
    const classes = []
    if (className) {
      classes.push(className)
    }
    if (statusPrefix) {
      classes.push(`${statusPrefix}${state.status}`)
    }
    const globalClassName = imgPool.globalVars.className
    if (globalClassName) {
      classes.push(globalClassName)
    }
    return classes.join(' ')
  }, [className, state.status, statusClassNamePrefix, imgPool])
  // --- 更新状态相关的函数 ---
  const loadingPromise = React.useRef<Promise<any>>()
  const loadImgWithDefaultImg = React.useCallback(
    (rect: DOMRect) => {
      const finalSrc = imgSrcTplFn({ src, rect })

      setState({
        src: finalDefaultSrc,
        originSrc: src,
        status: 'loading',
        rect,
      })
      const currentPromise = waitImgLoaded(finalSrc, crossOrigin)
      loadingPromise.current = currentPromise

      // 保证执行最后一次函数执行的变更
      currentPromise
        .catch(() => {
          if (loadingPromise.current !== currentPromise) {
            return
          }
          setState({
            src: finalErrorSrc,
            originSrc: src,
            status: 'error',
            rect,
          })
          onError?.()
        })
        .then((imgObj) => {
          if (loadingPromise.current !== currentPromise) {
            return
          }
          setState({
            src: finalSrc,
            originSrc: src,
            status: 'loaded',
            rect,
          })
          onLoaded?.(imgObj!)
        })
    },
    [crossOrigin, finalDefaultSrc, finalErrorSrc, imgSrcTplFn, onError, onLoaded, src]
  )
  const loadImgSync = React.useCallback(
    async (rect: DOMRect) => {
      setState({
        src: imgSrcTplFn({ src, rect }),
        originSrc: src,
        status: 'loaded',
        rect,
      })
    },
    [imgSrcTplFn, src]
  )

  const loadImg = React.useMemo(() => {
    if (loadingType === 'default') {
      return loadImgWithDefaultImg
    }
    return loadImgSync
  }, [loadImgWithDefaultImg, loadImgSync, loadingType])

  // 使用默认图片
  const update2DefaultSrc = React.useCallback(() => {
    setState({
      src: finalDefaultSrc,
      originSrc: src,
      status: 'loaded',
    })
  }, [finalDefaultSrc, src])

  // +++ 更新状态相关的函数 +++

  React.useEffect(() => {
    // 把当前图片实例放入到 imgPool 中
    poolRef.current.imgs.add(imgItemRef.current)
    return () => {
      poolRef.current.imgs.delete(imgItemRef.current)
    }
  }, [])

  const resizeCheckFn: ImgItem['onChecked'] = React.useCallback(
    async (eventType) => {
      // 如果有 resize 事件发生，那么要检测一下当前节点的大小有没有发生变化
      if (
        (eventType === 'resize' || eventType === 'scroll+resize') &&
        imgRef.current &&
        state.rect
      ) {
        const rect = imgRef.current.getBoundingClientRect()
        if (rect.width !== state.rect.width || rect.height !== state.rect.height) {
          loadImg(rect)
        }
      }
    },
    [loadImg, state.rect]
  )

  const lazyCheckFn: ImgItem['onChecked'] = React.useCallback(async () => {
    imgItemRef.current.shouldCheck = false
    if (!imgRef.current) {
      return
    }
    const rect = imgRef.current.getBoundingClientRect()
    if (poolRef.current.overlap(rect)) {
      loadImg(rect)
      if (lazy === 'resize') {
        imgItemRef.current.shouldCheck = true
        imgItemRef.current.onChecked = resizeCheckFn
      }
    } else {
      imgItemRef.current.shouldCheck = true
    }
  }, [lazy, loadImg, resizeCheckFn])

  React.useEffect(() => {
    // 当图片节点不存在时，不进行任何操作
    if (!imgRef.current) {
      return
    }

    // 如果 src 没变，那么不做任何操作
    if (src === state.originSrc) {
      return
    }

    // 如果 src 要设置为 '' ，那么使用默认图片
    if (src === '') {
      update2DefaultSrc()
      return
    }

    const rect = imgRef.current.getBoundingClientRect()
    // 如果关闭懒加载，那么直接加载图片
    if (!lazy) {
      loadImg(rect)
      return
    }

    // 执行第一次检测，如果不在容器区域范围内，等待下一次检测事件发生
    if (!poolRef.current.overlap(rect)) {
      imgItemRef.current.shouldCheck = true
      imgItemRef.current.onChecked = lazyCheckFn
      return
    }

    loadImg(rect)

    if (lazy === 'resize') {
      imgItemRef.current.shouldCheck = true
      imgItemRef.current.onChecked = resizeCheckFn
    }
  }, [
    lazy,
    loadImg,
    resizeCheckFn,
    lazyCheckFn,
    src,
    state.originSrc,
    state.status,
    update2DefaultSrc,
  ])

  return {
    state,
    className: finalClassName,
    defaultSrc: finalDefaultSrc,
    errorSrc: finalErrorSrc,
    imgPool: poolRef.current,

    others,

    // 一些处理函数
    handleRef,

    // for tests
    loadImg,
  }
}
