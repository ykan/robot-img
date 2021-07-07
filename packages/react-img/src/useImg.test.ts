import React from 'react'

import { act, renderHook } from '@testing-library/react-hooks'

import { useImg } from './useImg'

describe('测试 useImg', () => {
  test('一般情况', () => {
    const imgEl = window.document.createElement('div')
    const imgRef = React.createRef<HTMLDivElement>()
    ;(imgRef as any).current = imgEl
    const { result } = renderHook(() => useImg({}, imgRef))
  })
})
