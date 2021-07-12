import React from 'react'
import renderer from 'react-test-renderer'

import { Img, ImgDiv, ImgSpan } from './Img'
import { useImg, useImgWithStyle } from './useImg'

jest.mock('./useImg', () => ({
  useImg: jest.fn(),
  useImgWithStyle: jest.fn(),
}))

test('dom 快照', () => {
  ;(useImg as jest.Mock).mockReturnValue({
    className: 'g-img',
    state: {
      src: 'src',
    },
  })
  ;(useImgWithStyle as jest.Mock).mockReturnValue({
    className: 'g-img',
    style: {
      backgroundImage: 'url(ssss)',
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
