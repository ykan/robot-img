import { checkWebpSupported, isWindow, overlap, waitImgLoaded } from './utils'

describe('测试 overlap', () => {
  const container = {
    top: 0,
    bottom: 100,
    left: 0,
    right: 100,
  }

  test('包含情况', () => {
    expect(
      overlap(
        {
          top: 0,
          bottom: 90,
          left: 0,
          right: 90,
        },
        container
      )
    ).toBe(true)
  })

  test('部分重叠', () => {
    expect(
      overlap(
        {
          top: -90,
          bottom: 90,
          left: 0,
          right: 90,
        },
        container
      )
    ).toBe(true)

    expect(
      overlap(
        {
          top: 90,
          bottom: 120,
          left: 0,
          right: 90,
        },
        container
      )
    ).toBe(true)

    expect(
      overlap(
        {
          top: 0,
          bottom: 90,
          left: -20,
          right: 40,
        },
        container
      )
    ).toBe(true)

    expect(
      overlap(
        {
          top: 0,
          bottom: 90,
          left: 70,
          right: 120,
        },
        container
      )
    ).toBe(true)
  })

  test('不重叠', () => {
    expect(
      overlap(
        {
          top: -90,
          bottom: -10,
          left: 0,
          right: 90,
        },
        container
      )
    ).toBe(false)

    expect(
      overlap(
        {
          top: 110,
          bottom: 120,
          left: 0,
          right: 90,
        },
        container
      )
    ).toBe(false)

    expect(
      overlap(
        {
          top: 0,
          bottom: 90,
          left: -20,
          right: -10,
        },
        container
      )
    ).toBe(false)

    expect(
      overlap(
        {
          top: 0,
          bottom: 90,
          left: 110,
          right: 120,
        },
        container
      )
    ).toBe(false)
  })
})

describe('测试 isWindow', () => {
  test('isWindow', () => {
    expect(isWindow(window)).toBe(true)
    expect(isWindow({})).toBe(false)
  })
})

describe('测试 checkWebp && waitImgLoaded', () => {
  test('check webp', async () => {
    const win: any = window as any
    const FormerImage = win.Image
    let img: any
    win.Image = function () {
      img = this
      img.height = 1
    }

    const [p1] = await Promise.all([checkWebpSupported(), Promise.resolve(img.onload())])
    expect(p1).toBe(true)

    const [p2] = await Promise.all([checkWebpSupported(), Promise.resolve(img.onerror())])
    expect(p2).toBe(false)

    win.Image = FormerImage
  })

  test('set cross origin', async () => {
    const win: any = window as any
    const FormerImage = win.Image
    let img: any
    win.Image = function () {
      img = this
      img.height = 1
    }

    await Promise.all([waitImgLoaded('src', 'anonymous'), Promise.resolve(img.onload())])
    expect(img.crossOrigin).toBe('anonymous')

    win.Image = FormerImage
  })
})
