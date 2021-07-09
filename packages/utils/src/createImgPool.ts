import { createSrcTpl } from './createSrcTpl'
import { ImgEventType, ImgItem, ImgPool, ImgPoolOptions } from './types'
import { getContainerRect, overlap } from './utils'

let uid = 0
export function createImgPool(opts: ImgPoolOptions = {}): ImgPool {
  const {
    container = window,
    tickTime,
    containerRectFn,
    srcTpl,
    srcTplGlobalVars,
    globalVars,
    name,
  } = opts

  let tickTimer = -1
  let currentEventType: ImgEventType | 'none' = 'none'
  let isChecking = false
  let shouldUpdateContainerRect = false
  let innerContainerRect = getContainerRect(container, containerRectFn)
  let innerContainerRectFn = containerRectFn
  let destroyFn = () => {}
  let innerTickTime = tickTime || 150
  let innerContainer = container
  let innerGlobalVars = globalVars || {}
  let innerSrcTplGlobalVars = srcTplGlobalVars
  let innerSrcTpl = srcTpl
  let finalSrcTpl = createSrcTpl(innerSrcTpl, innerSrcTplGlobalVars)
  let innerName = name ? `${name}_${uid++}` : `${uid++}`
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
      if (newOpts.srcTplGlobalVars) {
        innerSrcTplGlobalVars = newOpts.srcTplGlobalVars
      }
      if (newOpts.srcTpl) {
        innerSrcTpl = newOpts.srcTpl
      }
      if (newOpts.srcTpl || newOpts.srcTplGlobalVars) {
        finalSrcTpl = createSrcTpl(innerSrcTpl, innerSrcTplGlobalVars)
      }
      if (newOpts.container) {
        innerContainer = newOpts.container
        innerContainerRect = getContainerRect(newOpts.container, innerContainerRectFn)
      }
      if (newOpts.name) {
        innerName = `${name}_${uid++}`
      }
      // 注意：如果只是改函数，容器没有变，那么也得更新一下
      if (newOpts.containerRectFn && !newOpts.container) {
        innerContainerRect = getContainerRect(newOpts.container, innerContainerRectFn)
      }
      if (newOpts.globalVars) {
        innerGlobalVars = newOpts.globalVars
      }
      instance.destroy()
      instance.init()
    },
    init() {
      const scrollHandler = () => {
        instance.occur('scroll')
      }
      const resizeHandler = () => {
        shouldUpdateContainerRect = true
        instance.occur('resize')
      }
      innerContainer.addEventListener('scroll', scrollHandler, true)
      innerContainer.addEventListener('resize', resizeHandler)
      destroyFn = () => {
        innerContainer.removeEventListener('scroll', scrollHandler, true)
        innerContainer.removeEventListener('resize', resizeHandler)
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
    },

    checkImgs(eventType, done) {
      const checkPromises: Promise<void>[] = []
      innerImgs.forEach((img) => {
        if (img.shouldCheck) {
          checkPromises.push(img.onChecked(eventType))
        }
      })
      if (checkPromises.length) {
        isChecking = true
        return Promise.all(checkPromises)
          .catch(() => {})
          .finally(() => {
            isChecking = false
            done?.()
          })
      }
    },

    update() {
      if (shouldUpdateContainerRect) {
        shouldUpdateContainerRect = false
        innerContainerRect = getContainerRect(innerContainer, innerContainerRectFn)
      }
      // 即没发生滚动，也没发生变形，那么啥也不干
      // 正在检测也啥都不干
      if (currentEventType === 'none' || isChecking) {
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
