import React from 'react'

import { createImgPool, waitImgLoaded } from '@robot-img/utils'
import { act, renderHook } from '@testing-library/react-hooks'

import { imgPool, ImgPoolContext } from './ImgPoolContext'
import { useImg } from './useImg'

jest.mock('@robot-img/utils', () => {
  return {
    ...jest.requireActual('@robot-img/utils'),
    waitImgLoaded: jest.fn(() => Promise.resolve({})),
  }
})

function waitTime(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('测试 useImg 跟 effect 相关的情况', () => {
  test('当 dom 节点不存在时不做任何操作', () => {
    const imgRef = React.createRef<HTMLDivElement>()
    const { result } = renderHook(() => useImg({}, imgRef))
    expect(result.current.state.status).toBe('blank')
  })

  test('当 src 没变时不做任何操作', () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    const { result } = renderHook(() => useImg({}, imgRef))
    result.current.handleRef!(imgEl)
    expect(result.current.state.status).toBe('blank')
    act(() => {
      result.current.loadImg(imgEl.getBoundingClientRect())
    })
  })

  test('img pool context change', () => {
    const imgRef = React.createRef<HTMLDivElement>()
    const defaultPool = createImgPool({ name: 'default_pool' })

    const wrapper = ({ children, pool = defaultPool }: any) => {
      return <ImgPoolContext.Provider value={pool}>{children}</ImgPoolContext.Provider>
    }
    const { result, rerender } = renderHook(() => useImg({}, imgRef), {
      wrapper,
    })

    rerender({ pool: createImgPool({ name: 'pool' }) })
    expect(result.current.imgPool === defaultPool).toBe(false)
  })

  test('src 从正常值变为空值', async () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    const pool = createImgPool({ name: 'pool' })

    const srcTpl = jest.fn((attrs) => 'ssss')
    jest.spyOn(pool, 'srcTpl').mockReturnValue(srcTpl)
    const wrapper = ({ children }: any) => {
      return <ImgPoolContext.Provider value={pool}>{children}</ImgPoolContext.Provider>
    }
    const { result, rerender } = renderHook(
      ({ src }: any = {}) => useImg({ src, lazy: false }, imgRef),
      {
        wrapper,
      }
    )
    result.current.handleRef!(imgEl)

    rerender({ src: 'src' })
    expect(result.current.state.src).toBe('ssss')
    expect(srcTpl).toHaveBeenCalledWith({
      src: 'src',
      rect: imgEl.getBoundingClientRect(),
    })

    rerender({ src: '' })

    expect(result.current.state.src).toBe('')
  })
})

describe('scroll & resize', () => {
  test('第一次加载时就在容器区域内的情况', () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    const pool = createImgPool({ name: 'pool' })

    const wrapper = ({ children }: any) => {
      return <ImgPoolContext.Provider value={pool}>{children}</ImgPoolContext.Provider>
    }
    const { result, rerender } = renderHook(({ src }: any = {}) => useImg({ src }, imgRef), {
      wrapper,
    })
    result.current.handleRef!(imgEl)

    rerender({ src: 'src' })
  })

  test('第一次加载时就不在容器区域内的情况', async () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    const pool = createImgPool({ name: 'pool', tickTime: 100 })
    const overlap = jest.spyOn(pool, 'overlap')
    overlap.mockReturnValue(false)

    const wrapper = ({ children }: any) => {
      return <ImgPoolContext.Provider value={pool}>{children}</ImgPoolContext.Provider>
    }
    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ src }: any = {}) => useImg({ src }, imgRef),
      {
        wrapper,
      }
    )
    result.current.handleRef!(imgEl)

    rerender({ src: 'src' })
    pool.occur('scroll')

    expect(overlap).toHaveBeenCalledTimes(1)

    overlap.mockReturnValue(true)
    await waitForNextUpdate()
    expect(overlap).toHaveBeenCalledTimes(2)
  })
})

describe('测试当图片设置了 loading 时的情况', () => {
  test('src 在加载过程中发生了变化，只执行最后一次状态变更', async () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    const onLoaded = jest.fn()
    const { result } = renderHook(() => useImg({ onLoaded, loadingType: 'default' }, imgRef))

    await act(async () => {
      await Promise.all([
        result.current.loadImg(imgEl.getBoundingClientRect()),
        result.current.loadImg(imgEl.getBoundingClientRect()),
      ])
    })
    expect(onLoaded).toHaveBeenCalledTimes(1)
  })

  test('src waitImgLoaded reject', async () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    const onError = jest.fn()
    const { result } = renderHook(() => useImg({ onError, loadingType: 'default' }, imgRef))
    ;(waitImgLoaded as jest.Mock).mockRejectedValue({})

    await act(async () => {
      await Promise.all([
        result.current.loadImg(imgEl.getBoundingClientRect()),
        result.current.loadImg(imgEl.getBoundingClientRect()),
      ])
    })
    expect(onError).toHaveBeenCalledTimes(1)
  })
})

describe('测试一些跟 imgPool 有关的情况', () => {
  test('className with status', () => {
    const imgRef = React.createRef<HTMLDivElement>()
    const imgEl = window.document.createElement('div')
    const { result } = renderHook(() =>
      useImg({ className: 'a', statusClassNamePrefix: 'b-' }, imgRef)
    )
    expect(result.current.className).toBe('a b-blank')

    imgPool.reset({ globalVars: { className: 'g-img' } })
    act(() => {
      result.current.loadImg(imgEl.getBoundingClientRect())
    })

    expect(result.current.className).toBe('a b-loaded g-img')
  })
})
