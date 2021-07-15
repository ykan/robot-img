import ResizeObserver from 'resize-observer-polyfill'

import { createSrcTpl } from './createSrcTpl'
import { getContainerRect, isWindow, overlap } from './utils'

import type { ImgEventType, ImgItem, ImgPool, ImgPoolOptions } from './types'
let uid = 0
export function createImgPool(opts: ImgPoolOptions = {}): ImgPool {
  const {
    container = window,
    tickTime,
    containerRectFn,
    createSrcTpl: argCreateSrcTpl,
    globalVars,
    name,
  } = opts

  // 内部变量
  let tickTimer = -1
  let currentEventType: ImgEventType | 'none' = 'none'
  let shouldUpdateContainerRect = false
  let innerContainerRect = getContainerRect(container, containerRectFn)
  let innerContainerRectFn = containerRectFn
  let destroyFn = () => {}
  let innerTickTime = tickTime || 150
  let innerContainer = container
  let innerGlobalVars = globalVars || {}
  let finalSrcTpl = createSrcTpl(argCreateSrcTpl)
  let innerName = name ? `${name}_${uid++}` : `${uid++}`
  let innerResizeObserver: ResizeObserver
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

    observe(element) {
      return innerResizeObserver.observe(element)
    },

    unobserve(element) {
      return innerResizeObserver.unobserve(element)
    },

    srcTpl(srcTpl) {
      return finalSrcTpl(srcTpl)
    },

    reset(newOpts) {
      if (newOpts.tickTime) {
        innerTickTime = newOpts.tickTime
      }
      if (newOpts.containerRectFn) {
        innerContainerRectFn = newOpts.containerRectFn
      }
      if (newOpts.createSrcTpl) {
        finalSrcTpl = createSrcTpl(newOpts.createSrcTpl)
      }
      if (newOpts.name) {
        innerName = `${newOpts.name}_${uid++}`
      }
      if (newOpts.container) {
        innerContainer = newOpts.container
        innerContainerRect = getContainerRect(newOpts.container, innerContainerRectFn)
      }
      // 注意：如果只是改函数，容器没有变，那么也得更新一下
      if (newOpts.containerRectFn && !newOpts.container) {
        innerContainerRect = getContainerRect(newOpts.container, innerContainerRectFn)
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
      innerContainer.addEventListener('scroll', scrollHandler, true)
      innerResizeObserver = new ResizeObserver(resizeHandler)
      if (isWindow(innerContainer)) {
        innerContainer.addEventListener('resize', resizeHandler)
        destroyFn = () => {
          innerContainer.removeEventListener('scroll', scrollHandler, true)
          innerContainer.removeEventListener('resize', resizeHandler)
          innerResizeObserver.disconnect()
        }
      } else {
        innerResizeObserver.observe(innerContainer)
        destroyFn = () => {
          innerContainer.removeEventListener('scroll', scrollHandler, true)
          innerResizeObserver.disconnect()
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
      } else if (eventType !== currentEventType) {
        currentEventType = eventType
      }

      if (currentEventType === 'resize' || currentEventType === 'scroll+resize') {
        shouldUpdateContainerRect = true
      }
    },

    checkImgs(eventType) {
      innerImgs.forEach((img) => {
        if (!img.shouldCheck) {
          return
        }
        // 需要保障检测不被意外中断
        try {
          img.onChecked(eventType)
        } catch (error) {
          img.onError?.(error)
        }
      })
    },

    update() {
      if (shouldUpdateContainerRect) {
        shouldUpdateContainerRect = false
        innerContainerRect = getContainerRect(innerContainer, innerContainerRectFn)
      }
      // 即没发生滚动，也没发生变形，那么啥也不干
      // 正在检测也啥都不干
      if (currentEventType === 'none') {
        return
      }
      instance.checkImgs(currentEventType)
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
  instance.tick(true)

  return instance
}
