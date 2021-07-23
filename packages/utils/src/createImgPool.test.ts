import { createImgPool } from './createImgPool'

function waitTime(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('tick & occur', () => {
  test('tick && tick(true)', () => {
    const pool = createImgPool({}, false)
    const updateFn = jest.spyOn(pool, 'update')
    pool.occur('scroll')
    pool.tick()
    pool.stopTick()
    expect(updateFn).toHaveBeenCalledTimes(1)
    expect(pool.currentEventType).toBe('none')
    updateFn.mockRestore()
  })

  test('custom tickTime', async () => {
    const pool = createImgPool({ tickTime: 5 })
    const updateFn = jest.spyOn(pool, 'update')
    await waitTime(60)

    // console.log(updateFn.mock.calls)
    expect(updateFn.mock.calls.length > 1).toBe(true)
    updateFn.mockRestore()
  })

  test('occur events', () => {
    const pool = createImgPool({}, false)
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
})

describe('测试跟容器变化相关的情况', () => {
  test('当发生 resize 时，再下一次心跳更新 containerRect', () => {
    const pool = createImgPool({}, false)
    const getContainerRect = jest.fn(() => ({ top: 0, bottom: 10, left: 0, right: 10 }))

    pool.reset({
      getContainerRect,
    })
    pool.occur('resize')
    pool.update()
    expect(getContainerRect).toHaveBeenCalledTimes(2)
  })

  test('window dispatch scroll or resize', () => {
    const pool = createImgPool()
    window.dispatchEvent(new Event('scroll'))
    expect(pool.currentEventType).toBe('scroll')
    window.dispatchEvent(new Event('resize'))
    expect(pool.currentEventType).toBe('scroll+resize')
  })

  test('container is a dom element', () => {
    const container = document.createElement('div')
    const mockRect = {
      top: window.innerHeight * 2,
      bottom: window.innerHeight * 2 + 200,
      height: 200,
      left: 0,
      right: 200,
      width: 200,
    }
    jest.spyOn(container, 'getBoundingClientRect').mockReturnValue(mockRect as DOMRect)
    const pool = createImgPool(
      {
        container,
      },
      false
    )
    pool.reset({ container })
    pool.update()
    expect(pool.isOverlapWindow).toBe(false)
  })
})

describe('测试图片检测相关情况', () => {
  test('update when imgs is not empty', () => {
    const pool = createImgPool({}, false)
    const onChecked = jest.fn()
    const img = {
      shouldCheck: true,
      onChecked,
    }
    pool.imgs.add(img)
    pool.occur('scroll')
    pool.update()
    expect(onChecked).toBeCalledTimes(1)
  })
  test('img has onUpdate', () => {
    const pool = createImgPool({}, false)
    const onUpdate = jest.fn()
    const onChecked = jest.fn()
    const img = {
      shouldCheck: false,
      onUpdate,
      onChecked,
    }
    pool.imgs.add(img)
    pool.occur('scroll')
    pool.update()
    expect(onUpdate).toBeCalledTimes(1)
    expect(onChecked).toBeCalledTimes(0)
  })
})

describe('init & reset', () => {
  test('reset tickTime', () => {
    const pool = createImgPool({}, false)
    pool.reset({ tickTime: 10 })
    expect(pool.tickTime).toBe(10)
  })
  test('reset name', () => {
    const pool = createImgPool({ name: 'name' }, false)
    expect(pool.name.includes('name')).toBe(true)
    pool.reset({ name: 'custom' })
    expect(pool.name.includes('custom')).toBe(true)
  })
  test('reset globalVar', () => {
    const pool = createImgPool({ name: 'name' }, false)
    pool.reset({
      globalVars: {
        defaultSrc: 'src',
      },
    })
    expect(pool.globalVars.defaultSrc).toBe('src')
  })
  test('reset createSrcTpl', () => {
    const pool = createImgPool({}, false)
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
    const pool = createImgPool({}, false)
    const container = window.document.createElement('div')
    const spy = jest.spyOn(container, 'getBoundingClientRect')
    const result = { bottom: 300, height: 200, left: 0, right: 200, top: 100, width: 200 }
    spy.mockReturnValue(result as DOMRect)
    pool.reset({ container })
    expect(pool.container).toBe(container)

    expect(pool.containerRect).toEqual({
      top: 0,
      bottom: 400,
      left: -100,
      right: 300,
    })
  })

  test('reset containerRect', () => {
    const pool = createImgPool({}, false)
    const containerRect = {
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
    }
    pool.reset({ getContainerRect: () => containerRect })
    expect(pool.containerRect).toBe(containerRect)
    expect(pool.overlap({ top: 50, bottom: 120, left: 0, right: 50 })).toBe(true)
  })

  test('appendDefaultStyle', () => {
    const insertAdjacentHTML = jest.spyOn(window.document.head, 'insertAdjacentHTML')

    const pool = createImgPool({}, false)
    pool.appendDefaultStyle()
    expect(insertAdjacentHTML).not.toBeCalled()
    pool.reset({ globalVars: { className: 'img' } })
    pool.appendDefaultStyle()
    expect(insertAdjacentHTML).toHaveBeenCalled()
  })
})
