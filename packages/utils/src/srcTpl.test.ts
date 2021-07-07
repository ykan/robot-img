import { createAliOssRenderFn, createSrcTpl } from './srcTpl'

describe('默认情况', () => {
  const srcTpl = createSrcTpl()
  const mockRect = {
    width: 100,
    height: 100,
  }

  test('默认', () => {
    expect(
      srcTpl()({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('src')
  })

  test('param is function', () => {
    const fn = jest.fn((arg) => 'none')
    expect(
      srcTpl(fn)({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('none')
    expect(fn.mock.calls[0][0]).toHaveProperty('src', 'src')
    expect(fn.mock.calls[0][0]).toHaveProperty('rect', mockRect)
    expect(fn.mock.calls[0][0]).toHaveProperty('webp', false)
  })

  test('自定义全局默认处理函数', () => {
    const globalSrcTpl = createSrcTpl(() => 'src1', { webp: false, ratio: 1 })
    expect(
      globalSrcTpl()({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('src1')
  })
})

describe('test ali oss tpl render function', () => {
  test('webp = true, resize', () => {
    const tpl = createAliOssRenderFn({
      webp: true,
      ratio: 1.5,
    })
    const mockRect = {
      width: 100,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src?x-oss-process=image/resize,m_fill,w_150,h_150/format,webp')
  })

  test('width = 0', () => {
    // 用全局的来实例化
    const tpl = createSrcTpl('ali-oss', {
      webp: false,
      ratio: 1.5,
    })
    const mockRect = {
      width: 0,
      height: 100,
    }
    const result = tpl()({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src')
  })
})
