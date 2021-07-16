import { createSrcTpl } from './createSrcTpl'
import { isWindow, overlap } from './utils'

import type { ImgEventType, ImgItem, ImgPool, ImgPoolOptions, ImgRect } from './types'
let uid = 0

function getWinRect() {
  const rect = {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    width: window.innerWidth,
    height: window.innerHeight,
  }
  return rect as DOMRect
}

function defaultGetContainerRect(rect: DOMRect) {
  return {
    top: rect.top - rect.height * 0.5,
    bottom: rect.bottom + rect.height * 0.5,
    left: rect.left - rect.width * 0.5,
    right: rect.right + rect.width * 0.5,
  }
}
export function createImgPool(opts: ImgPoolOptions = {}, autoTick = true): ImgPool {
  const {
    container = window,
    tickTime,
    getContainerRect = defaultGetContainerRect,
    createSrcTpl: argCreateSrcTpl,
    globalVars,
    name,
  } = opts

  // 内部变量
  let tickTimer = -1
  let currentEventType: ImgEventType | 'none' = 'none'
  let innerContainerRect: ImgRect
  let destroyFn = () => {}
  let innerTickTime = tickTime || 150
  let innerContainer = container
  let innerGetContainerRect = getContainerRect
  let innerGlobalVars = globalVars || {}
  let finalSrcTpl = createSrcTpl(argCreateSrcTpl)
  let innerName = name ? `${name}_${uid++}` : `${uid++}`
  let innerIsOverlapWindow = false
  let innerOverlapWindowCheck = () => {}
  const innerImgs: Set<ImgItem> = new Set()

  const instance: ImgPool = {
    get imgs() {
      return innerImgs
    },
    get currentEventType() {
      return currentEventType
    },

    get tickTime() {
      return innerTickTime
    },

    get containerRect() {
      return innerContainerRect
    },

    get container() {
      return innerContainer
    },

    get globalVars() {
      return innerGlobalVars
    },

    get name() {
      return innerName
    },

    get isOverlapWindow() {
      return innerIsOverlapWindow
    },

    srcTpl(srcTpl) {
      return finalSrcTpl(srcTpl)
    },

    reset(newOpts) {
      if (newOpts.tickTime) {
        innerTickTime = newOpts.tickTime
      }
      if (newOpts.getContainerRect) {
        innerGetContainerRect = newOpts.getContainerRect
      }
      if (newOpts.createSrcTpl) {
        finalSrcTpl = createSrcTpl(newOpts.createSrcTpl)
      }
      if (newOpts.name) {
        innerName = `${newOpts.name}_${uid++}`
      }
      if (newOpts.container) {
        innerContainer = newOpts.container
      }
      if (newOpts.globalVars) {
        innerGlobalVars = newOpts.globalVars
      }
      instance.init()
    },
    init() {
      instance.destroy()
      const scrollHandler = () => {
        instance.occur('scroll')
      }
      const resizeHandler = () => {
        instance.occur('resize')
      }
      window.addEventListener('scroll', scrollHandler, true)
      window.addEventListener('resize', resizeHandler)
      if (isWindow(innerContainer)) {
        innerIsOverlapWindow = true
        innerOverlapWindowCheck = () => {
          innerContainerRect = innerGetContainerRect(getWinRect())
        }
        innerContainerRect = innerGetContainerRect(getWinRect())
        destroyFn = () => {
          window.removeEventListener('scroll', scrollHandler, true)
          window.removeEventListener('resize', resizeHandler)
        }
      } else {
        innerContainer.addEventListener('scroll', scrollHandler, true)
        innerContainerRect = innerGetContainerRect(innerContainer.getBoundingClientRect())
        innerOverlapWindowCheck = () => {
          const containerRect = (innerContainer as HTMLElement).getBoundingClientRect()
          innerContainerRect = innerGetContainerRect(containerRect)
          innerIsOverlapWindow = overlap(getWinRect(), containerRect)
        }
        destroyFn = () => {
          innerContainer.removeEventListener('scroll', scrollHandler, true)
          window.removeEventListener('scroll', scrollHandler, true)
          window.removeEventListener('resize', resizeHandler)
        }
      }
    },
    destroy() {
      destroyFn()
    },
    overlap(rect) {
      return overlap(rect, innerContainerRect)
    },
    occur(eventType) {
      if (currentEventType === 'scroll+resize') {
        return
      }
      if (eventType === 'resize' && currentEventType === 'scroll') {
        currentEventType = 'scroll+resize'
      } else if (eventType === 'scroll' && currentEventType === 'resize') {
        currentEventType = 'scroll+resize'
      } else {
        currentEventType = eventType
      }
    },

    update() {
      innerOverlapWindowCheck()
      for (const img of innerImgs) {
        img.onUpdate?.()
      }
      // 即没发生滚动，也没发生变形，那么啥也不干
      // 正在检测也啥都不干
      if (currentEventType === 'none') {
        return
      }
      // 如果容器不在窗口内，就不做检测了
      if (innerIsOverlapWindow) {
        for (const img of innerImgs) {
          if (img.shouldCheck) {
            img.onChecked(currentEventType)
          }
        }
      }
      currentEventType = 'none'
    },
    tick(isStart = false) {
      // 防止执行很多遍
      clearTimeout(tickTimer)
      if (!isStart) {
        instance.update()
      }
      tickTimer = window.setTimeout(() => {
        instance.tick()
      }, innerTickTime)
    },
    stopTick() {
      clearTimeout(tickTimer)
    },
  }

  instance.init()
  if (autoTick) {
    instance.tick(true)
  }

  return instance
}
