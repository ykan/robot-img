import type { ImgRect } from './types'

/**
 * 检查两个矩形是否相交
 * @param rect 要检查的矩形
 * @param container 容器矩形
 */
export function overlap(rect: ImgRect, container: ImgRect) {
  const topBottomIn =
    (rect.top >= container.top && rect.top <= container.bottom) || // 图片的上边在区域内
    (rect.top <= container.top && rect.bottom >= container.bottom) || // 图片大于区域
    (rect.bottom >= container.top && rect.bottom <= container.bottom) // 图片的下边在区域内
  const leftRightIn =
    (rect.left >= container.left && rect.left <= container.right) || // 图片的上边在区域内
    (rect.left <= container.left && rect.right >= container.right) || // 图片大于区域
    (rect.right >= container.left && rect.right <= container.right) // 图片的下边在区域内

  return topBottomIn && leftRightIn
}

export function isWindow(obj: Window | any): obj is Window {
  return obj === (obj as Window).window
}

export function waitImgLoaded(imgSrc: string, crossOrigin?: 'anonymous' | 'use-credentials' | '') {
  const { Image } = window // 写在里面有一个好处：在测试代码里更容易 mock
  const img: HTMLImageElement = new Image()
  if (crossOrigin) {
    img.crossOrigin = crossOrigin
  }
  return new Promise<HTMLImageElement>((resolve, reject) => {
    img.onerror = (e: string | Event) => {
      reject(e)
    }
    img.onload = () => {
      resolve(img)
    }
    img.src = imgSrc
  })
}

export async function checkWebpSupported() {
  try {
    await waitImgLoaded(
      'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA=='
    )
    return true
  } catch (e) {}
  return false
}

// copy from: https://stackoverflow.com/questions/5573096/detecting-webp-support/27232658#27232658
export function checkWebpSupportedSync() {
  const elem = window.document.createElement('canvas')

  if (elem?.getContext('2d')) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } else {
    // very old browser like IE 8, canvas not supported
    return false
  }
}
