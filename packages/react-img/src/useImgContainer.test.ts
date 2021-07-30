import React from 'react'

import { renderHook } from '@testing-library/react-hooks'

import { useImgContainer } from './useImgContainer'

jest.mock('@robot-img/utils', () => {
  const allMods = jest.requireActual('@robot-img/utils')
  return {
    ...allMods,
    createImgPool: (opts: any) => {
      const pool = allMods.createImgPool(opts)
      jest.spyOn(pool, 'reset')
      return pool
    },
  }
})

afterAll(() => {
  jest.unmock('@robot-img/utils')
})

test('一般情况', () => {
  const container = window.document.createElement('div')
  const containerRef = React.createRef<HTMLDivElement>()
  ;(containerRef as any).current = container
  const { result } = renderHook(({ name }: any = {}) => useImgContainer({ name }, containerRef))
  expect(result.current.pool.reset).toHaveBeenCalled()
})
