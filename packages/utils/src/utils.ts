import { ImgPoolOptions, ImgRect } from './types'

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

const defaultContainerFn = (rect: DOMRect) => ({
  top: rect.top - rect.height * 0.5,
  bottom: rect.bottom + rect.height * 0.5,
  left: rect.left - rect.width * 0.5,
  right: rect.right + rect.width * 0.5,
})
export function getContainerRect(
  container: ImgPoolOptions['container'] = window,
  containerRectFn: ImgPoolOptions['containerRectFn'] = defaultContainerFn
): ImgRect {
  if (isWindow(container)) {
    const rect = {
      top: 0,
      bottom: container.innerHeight,
      left: 0,
      right: container.innerWidth,
      width: container.innerWidth,
      height: container.innerHeight,
    }
    return containerRectFn(rect as DOMRect)
  }
  const rect = container.getBoundingClientRect()
  return containerRectFn(rect)
}

/**
 * 检测是否可用 webp 格式
 * 正常耗时，低于 1ms
 */
export function checkWebp(): Promise<boolean> {
  return new Promise((resolve) => {
    const { Image } = window
    const img = new Image() // eslint-disable-line
    img.onload = () => {
      resolve(img.height === 1)
    }
    img.onerror = () => {
      resolve(false)
    }
    img.src =
      'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA=='
  })
}
