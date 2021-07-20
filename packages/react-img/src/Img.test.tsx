import React from 'react'
import renderer from 'react-test-renderer'

import { Img, ImgContainer, ImgDiv, ImgSpan } from './Img'
import { useImg, useImgWithStyle } from './useImg'
import { useImgContainer } from './useImgContainer'

jest.mock('./useImg', () => ({
  useImg: jest.fn(),
  useImgWithStyle: jest.fn(),
}))
jest.mock('./useImgContainer', () => ({
  useImgContainer: jest.fn(),
}))

test('img dom 快照', () => {
  ;(useImg as jest.Mock).mockReturnValue({
    domProps: {
      className: 'g-img',
    },
    state: {
      src: 'src',
    },
  })
  ;(useImgWithStyle as jest.Mock).mockReturnValue({
    domProps: {
      className: 'g-img',
      style: {
        backgroundImage: 'url(ssss)',
      },
    },
    state: {
      src: 'src',
    },
  })

  const tree = renderer
    .create(
      <>
        <Img src="sss" />
        <ImgDiv src="sss" />
        <ImgSpan src="sss" />
      </>
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('img container 快照', () => {
  ;(useImgContainer as jest.Mock).mockReturnValue({
    domProps: {},
  })

  const tree = renderer.create(<ImgContainer />).toJSON()

  expect(tree).toMatchSnapshot()
})
