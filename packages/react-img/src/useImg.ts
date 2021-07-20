import React from 'react'

import { ImgItem, waitImgLoaded } from '@robot-img/utils'

import { ImgPoolContext } from './ImgPoolContext'
import { useForkRef } from './useForkRef'

import type { ImgProps, ImgState } from './types'

function defaultShouldUpdate(newRect: DOMRect, oldRect: DOMRect) {
  const newArea = newRect.width * newRect.height
  const oldArea = oldRect.width * oldRect.height

  // 当面积变大 20% 时，才更新图片
  return newArea > oldArea * 1.2
}

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
    shouldUpdate = defaultShouldUpdate,
    ...othersProps
  } = props
  const imgRef = React.useRef<T>(null)
  const handleRef = useForkRef(ref, imgRef)
  // 要保障整个生命周期只有一个引用
  const imgItemRef = React.useRef<ImgItem>({
    shouldCheck: false,
    onChecked: () => {},
  })
  // 当在 useMemo 中时，用 imgPool ，因为值要随 imgPool 变更
  const imgPool = React.useContext(ImgPoolContext)
  // 当在一些函数中时，由于 ref 肯定更新了，用 poolRef ，这样 hooks 里少一次对比
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
    () => defaultSrc || imgPool.globalVars.defaultSrc || '',
    [defaultSrc, imgPool]
  )
  const finalErrorSrc = React.useMemo(
    () => errorSrc || imgPool.globalVars.errorSrc || '',
    [errorSrc, imgPool]
  )
  const finalLoadingType = React.useMemo(() => {
    return loadingType || imgPool.globalVars.loadingType || 'none'
  }, [loadingType, imgPool])

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

  // 异步更新 src ，状态变更可能会 loading -> loaded 或者 loading -> error

  const loadingPromise = React.useRef<Promise<any>>()
  const loadImgWithStatus = React.useCallback(
    (rect: DOMRect) => {
      const finalSrc = imgSrcTplFn({ src, rect })

      setState({
        src: finalLoadingType === 'src' ? finalDefaultSrc : '',
        originSrc: src,
        status: 'loading',
        rect,
      })
      const currentPromise = waitImgLoaded(finalSrc, crossOrigin)
      loadingPromise.current = currentPromise

      // 保证执行最后一次函数执行的变更
      currentPromise
        .catch((reason) => {
          if (loadingPromise.current !== currentPromise) {
            return
          }
          setState({
            src: finalLoadingType === 'src' ? finalErrorSrc : '',
            originSrc: src,
            status: 'error',
            rect,
          })
          onError?.(reason)
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
    [
      crossOrigin,
      finalDefaultSrc,
      finalErrorSrc,
      finalLoadingType,
      imgSrcTplFn,
      onError,
      onLoaded,
      src,
    ]
  )
  const loadImgSync = React.useCallback(
    (rect: DOMRect) => {
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
    if (finalLoadingType === 'none') {
      return loadImgSync
    }
    return loadImgWithStatus
  }, [loadImgWithStatus, loadImgSync, finalLoadingType])

  React.useEffect(() => {
    // 把当前图片实例放入到 imgPool 中
    poolRef.current.imgs.add(imgItemRef.current)
    return () => {
      poolRef.current.imgs.delete(imgItemRef.current)
    }
  }, [])

  const updateCheckFn = React.useCallback(() => {
    // 根据心跳函数做判断，节点的 DOMRect 有没有发生变化
    if (state.rect && imgRef.current && poolRef.current.isOverlapWindow) {
      const rect = imgRef.current.getBoundingClientRect()
      // 不在容器内，也不更新
      if (!poolRef.current.overlap(rect)) {
        return
      }
      if (shouldUpdate(rect, state.rect)) {
        loadImg(rect)
      }
    }
  }, [loadImg, shouldUpdate, state.rect])

  const lazyCheckFn: ImgItem['onChecked'] = React.useCallback(() => {
    imgItemRef.current.shouldCheck = false
    // 额外保障，逻辑正常的话，不应该会走到这
    /* istanbul ignore next */
    if (!imgRef.current) {
      return
    }
    const rect = imgRef.current.getBoundingClientRect()
    if (poolRef.current.overlap(rect)) {
      loadImg(rect)
    } else {
      imgItemRef.current.shouldCheck = true
    }
  }, [loadImg])

  React.useEffect(() => {
    // 当图片节点不存在时，不进行任何操作
    if (!imgRef.current) {
      return
    }

    // 如果 src 没变，那么不做任何操作
    if (src === state.originSrc) {
      return
    }

    // 如果 src 要设置为 '' ，那么设置为默认状态
    if (src === '') {
      setState({
        src: '',
        originSrc: '',
        status: 'blank',
      })
      return
    }

    const rect = imgRef.current.getBoundingClientRect()
    // 如果关闭懒加载，那么直接加载图片
    if (!lazy) {
      loadImg(rect)
      return
    }

    // 执行第一次检测，如果不在容器区域范围内，等待下一次检测事件发生
    // 这里不需要考虑 lazy="resize" 的情况，没加载必然都要进行检测
    if (!poolRef.current.overlap(rect)) {
      imgItemRef.current.shouldCheck = true
      imgItemRef.current.onChecked = lazyCheckFn
      return
    }

    loadImg(rect)
  }, [lazy, lazyCheckFn, loadImg, src, state.originSrc, state.rect, state.status])

  React.useEffect(() => {
    if (state.status === 'loaded' && lazy === 'resize' && imgRef.current) {
      imgItemRef.current.onUpdate = updateCheckFn
    }
  }, [lazy, state.status, updateCheckFn])

  return {
    state,
    defaultSrc: finalDefaultSrc,
    errorSrc: finalErrorSrc,
    imgPool: poolRef.current,

    crossOrigin,
    domProps: {
      ...othersProps,
      className: finalClassName,
    },

    // 一些处理函数
    handleRef,

    // for tests
    loadImg,
  }
}

export function useImgWithStyle<T extends HTMLElement>(props: ImgProps<T>, ref: React.Ref<T>) {
  const { domProps, state, ...othersProps } = useImg(props, ref)
  const { style, ...others } = domProps
  const finalStyle = React.useMemo(() => {
    let cssBackgroundImage
    if (state.src) {
      cssBackgroundImage = `url(${state.src})`
    }
    if (cssBackgroundImage) {
      return {
        ...style,
        backgroundImage: cssBackgroundImage,
      }
    }
    return style
  }, [state.src, style])
  return {
    ...othersProps,
    domProps: {
      ...others,
      style: finalStyle,
    },
    state,
  }
}
