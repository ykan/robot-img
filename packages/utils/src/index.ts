export * from './types'
export { createImgPool } from './createImgPool'
export { checkWebpSupported, waitImgLoaded, checkWebpSupportedSync } from './utils'
export {
  createSrcTplOfAliOss,
  createSrcTplOfKSYunKS3,
  createSrcTplOfQiniu,
  createSrcTplOfTencent,
  createSrcTplFactory,
} from './createSrcTpl'
