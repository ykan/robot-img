import { createSrcTpl } from './createSrcTpl'

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
    const a: any = {}
    const globalSrcTpl = createSrcTpl(() => 'src1', { webp: false, ratio: 1 })
    expect(
      globalSrcTpl()({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('src1')
  })
})
