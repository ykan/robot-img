import { createSrcTplOfAliOss } from './createSrcTplOfAliOss'

describe('test ali oss tpl render function', () => {
  test('webp = true, resize', () => {
    const tpl = createSrcTplOfAliOss({
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
    const tpl = createSrcTplOfAliOss({
      webp: false,
      ratio: 1.5,
    })
    const mockRect = {
      width: 0,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src')
  })
})
