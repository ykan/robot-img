import { createSrcTpl } from './srcTpl'
import { ImgCheckType, ImgItem, ImgPool, ImgPoolOptions } from './types'
import { getContainerRect, overlap } from './utils'

export function createImgPool(opts: ImgPoolOptions = {}): ImgPool {
  const { container = window, tickTime, containerRectFn, srcTpl, globalVars } = opts

  let tickTimer = -1
  let currentCheckType: ImgCheckType = 'none'
  let isChecking = false
  let innerContainerRect = getContainerRect(container, containerRectFn)
  let innerContainerRectFn = containerRectFn
  let destroyFn = () => {}
  let innerTickTime = tickTime || 150
  let innerContainer = container
  const innerSrcTpl = createSrcTpl(srcTpl, globalVars)
  const innerImgs: Set<ImgItem> = new Set()

  const instance: ImgPool = {
    get imgs() {
      return innerImgs
    },
    get currentCheckType() {
      return currentCheckType
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

    srcTpl(srcTpl) {
      return innerSrcTpl(srcTpl)
    },

    reset(newOpts) {
      if (newOpts.tickTime) {
        innerTickTime = newOpts.tickTime
      }
      if (newOpts.containerRectFn) {
        innerContainerRectFn = newOpts.containerRectFn
      }
      if (newOpts.container) {
        innerContainer = newOpts.container
        innerContainerRect = getContainerRect(newOpts.container, innerContainerRectFn)
      }
      // 注意：如果只是改函数，容器没有变，那么也得更新一下
      if (newOpts.containerRectFn && !newOpts.container) {
        innerContainerRect = getContainerRect(newOpts.container, innerContainerRectFn)
      }
      instance.destroy()
      instance.init()
    },
    init() {
      const scrollHandler = () => {
        instance.occur('scroll')
      }
      const resizeHandler = () => {
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
    occur(type) {
      if (type === 'scroll' && currentCheckType === 'none') {
        currentCheckType = 'scroll'
      } else if (type === 'resize' && currentCheckType === 'none') {
        currentCheckType = 'resize'
      } else if (type === 'resize' && currentCheckType === 'scroll') {
        currentCheckType = 'scroll+resize'
      } else if (type === 'scroll' && currentCheckType === 'resize') {
        currentCheckType = 'scroll+resize'
      }
    },

    checkImgs(done) {
      const checkPromises: Promise<void>[] = []
      innerImgs.forEach((img) => {
        if (img.shouldCheck && img.checkType === currentCheckType) {
          checkPromises.push(img.onChecked())
        }
      })
      if (checkPromises.length) {
        isChecking = true
        return Promise.all(checkPromises)
          .catch(() => {})
          .finally(() => {
            isChecking = false
            done!()
          })
      }
    },

    update() {
      // 即没发生滚动，也没发生变形，那么啥也不干
      // 正在检测也啥都不干
      if (currentCheckType === 'none' || isChecking) {
        return
      }
      currentCheckType = 'none'
      instance.checkImgs()
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
