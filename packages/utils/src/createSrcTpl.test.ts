import {
  createSrcTpl,
  createSrcTplOfAliOss,
  createSrcTplOfKSYunKS3,
  createSrcTplOfQiniu,
  createSrcTplOfTencent,
} from './createSrcTpl'

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
    const globalSrcTpl = createSrcTpl(() => [() => 'src1', { webp: false, ratio: 1 }])
    expect(
      globalSrcTpl()({
        src: 'src',
        rect: mockRect as DOMRect,
      })
    ).toBe('src1')
  })
})

describe('测试阿里云的图片处理', () => {
  test('webp = true, resize', () => {
    const [tpl] = createSrcTplOfAliOss({
      webp: true,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 100,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src?x-oss-process=image/resize,m_fill,w_150,h_150/format,webp')
  })

  test('width = 0', () => {
    const [tpl] = createSrcTplOfAliOss({
      webp: false,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 0,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src')
  })
})

describe('测试金山云的图片处理', () => {
  test('webp = true, resize', () => {
    const [tpl] = createSrcTplOfKSYunKS3({
      webp: true,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 100,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src@base@tag=imgScale&m=1&c=1&w=150&h=150&F=webp')
  })

  test('width = 0', () => {
    const [tpl] = createSrcTplOfKSYunKS3({
      webp: false,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 0,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src')
  })
})

describe('测试七牛云的图片处理', () => {
  test('webp = true, resize', () => {
    const [tpl] = createSrcTplOfQiniu({
      webp: true,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 100,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src?imageView2/1/w/150/h/150/format/webp')
  })

  test('width = 0', () => {
    const [tpl] = createSrcTplOfQiniu({
      webp: false,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 0,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src')
  })
})

describe('测试腾讯云的图片处理', () => {
  test('webp = true, resize', () => {
    const [tpl] = createSrcTplOfTencent({
      webp: true,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 100,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src?imageMogr2/crop/150x150/format/webp')
  })
  test('width = 0', () => {
    const [tpl] = createSrcTplOfTencent({
      webp: false,
      ratio: 1.5,
    })()
    const mockRect = {
      width: 0,
      height: 100,
    }
    const result = tpl({ rect: mockRect as DOMRect, src: 'src' })
    expect(result).toBe('src')
  })
})
