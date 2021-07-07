import React from 'react'

import { createImgPool, ImgPool } from '@robot-img/utils'

export const imgPool = createImgPool()

export const ImgPoolContext = React.createContext<ImgPool>(imgPool)
