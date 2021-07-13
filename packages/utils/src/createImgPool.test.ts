import { createImgPool } from './createImgPool'

function waitTime(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('tick & occur', () => {
  const pool = createImgPool()

  test('tick', () => {
    const checkImgs = jest.spyOn(pool, 'checkImgs')
    pool.occur('scroll')
    pool.tick()
    pool.stopTick()
    expect(checkImgs).toHaveBeenCalledTimes(1)
    expect(pool.currentEventType).toBe('none')
    checkImgs.mockRestore()
  })

  test('tick times', async () => {
    const pool1 = createImgPool({ tickTime: 10 })
    const updateFn = jest.spyOn(pool1, 'update')
    await waitTime(100)
    // console.log(updateFn.mock.calls)
    expect(updateFn.mock.calls.length > 1).toBe(true)
    updateFn.mockRestore()
  })

  test('occur', () => {
    expect(pool.currentEventType).toBe('none')
    pool.occur('scroll')
    expect(pool.currentEventType).toBe('scroll')
    pool.occur('resize')
    expect(pool.currentEventType).toBe('scroll+resize')

    pool.tick()
    pool.stopTick()

    expect(pool.currentEventType).toBe('none')
    pool.occur('resize')
    expect(pool.currentEventType).toBe('resize')
    pool.occur('scroll')
    expect(pool.currentEventType).toBe('scroll+resize')
    pool.occur('scroll')
    expect(pool.currentEventType).toBe('scroll+resize')
  })

  test('当发生 resize 时，再下一次心跳更新 containerRect', () => {
    const containerRectFn = jest.fn(() => ({ top: 0, bottom: 10, left: 0, right: 10 }))

    pool.reset({
      containerRectFn,
    })
    pool.occur('resize')
    pool.update()
    expect(containerRectFn).toHaveBeenCalledTimes(2)
  })
})

describe('init & reset', () => {
  const pool = createImgPool()
  test('reset tickTime', () => {
    pool.reset({ tickTime: 10 })
    expect(pool.tickTime).toBe(10)
  })
  test('reset name', () => {
    pool.reset({ name: 'custom' })
    expect(pool.name.includes('custom')).toBe(true)
  })
  test('reset createSrcTpl', () => {
    const mockRect = {
      width: 100,
      height: 100,
    }
    expect(
      pool.srcTpl()({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('src')

    pool.reset({
      createSrcTpl: () => [() => 'new src tpl', { webp: false, ratio: 1 }],
    })

    expect(
      pool.srcTpl()({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('new src tpl')
  })

  test('reset container', () => {
    const container = window.document.createElement('div')
    const spy = jest.spyOn(container, 'getBoundingClientRect')
    const result = { bottom: 300, height: 200, left: 0, right: 200, top: 100, width: 200 }
    spy.mockReturnValue(result as DOMRect)
    pool.reset({ container })
    const occur = jest.spyOn(pool, 'occur')
    container.dispatchEvent(new Event('scroll'))
    container.dispatchEvent(new Event('resize'))
    expect(pool.containerRect).toEqual({
      top: 0,
      bottom: 400,
      left: -100,
      right: 300,
    })
    expect(pool.container).toBe(container)
    expect(occur).toHaveBeenCalled()
    spy.mockRestore()
    occur.mockRestore()
  })

  test('reset containerRect', () => {
    const containerRect = {
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
    }
    pool.reset({ containerRectFn: () => containerRect })
    expect(pool.containerRect).toBe(containerRect)
    expect(pool.overlap({ top: 50, bottom: 120, left: 0, right: 50 })).toBe(true)
  })
})

describe('check imgs', () => {
  const pool = createImgPool()
  test('当没有图片需要检测时，不做任何处理', () => {
    pool.imgs.add({
      shouldCheck: false,
      onChecked: async () => {},
    })
    pool.checkImgs('scroll')
    pool.imgs.clear()
  })
  test('检测图片', (done) => {
    const img = {
      shouldCheck: true,
      checkType: 'scroll',
      onChecked: async () => {
        img.shouldCheck = false
      },
    }

    const onChecked = jest.spyOn(img, 'onChecked')
    pool.imgs.add(img)
    pool.occur('scroll')
    pool.checkImgs('scroll', () => {
      done()
      pool.checkImgs('scroll')
      expect(onChecked).toBeCalledTimes(1)
      pool.imgs.clear()
    })
  })

  test('检测图片时出错', (done) => {
    const img = {
      shouldCheck: true,
      checkType: 'scroll',
      onChecked: async () => {
        img.shouldCheck = false
        throw new Error('ss')
      },
    }
    pool.imgs.add(img)
    pool.occur('scroll')
    pool.checkImgs('scroll', () => {
      done()
      pool.imgs.clear()
    })
  })
})
