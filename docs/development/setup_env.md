# 搭建开发环境

## 版本管理

- [x] `.gitignore`
- [x] `cz` ，使用自定义的 cz
- [x] `husky`

## 编码相关

- [x] 目录结构
- [x] `.editorconfig`
- [x] `eslint`
- [x] `lint-stage`
- [x] `prettier`
- [x] `babel` 配置
- [x] `ts` 配置

## 开发调试

- [x] `yarn`
- [x] `vite` 搭建开发环境
  - [x] API 文档生成
  - [x] Demo 调试
  - [x] Demo to codesandbox
- [x] `jest` 单测
- [] `e2e` 测试

## 发包相关

- [x] 使用 rollup 进行打包
- [x] 单分支提交跑单测，并提交 Test Report ，详见： [.github/workflows/ci.yml](.github/workflows/ci.yml)
- [x] 使用 Github Actions 进行发包，详见： [.github/workflows/release.yml](.github/workflows/release.yml)
- [] `CHANGELOG`


## npm scripts 说明

- `npm run dev` ：启动本地文档开发环境
- `npm run doc:w` ：构建文档的 watch 模式
- `npm run commit` ：提交代码
- `npm run clean` ：清空构建产生的文件
- `npm run codesandbox` ：构建 codesandbox 案例
- `npm run build` ：构建 npm 包
- `npm run build:api` ：构建 API 文档（开发模式）
- `npm run test` ：执行所有测试
- `npm run test:last` ：只执行跟 origin/main 对比变更的测试文件
- `npm run test:clear` ：清理测试产生的缓存
- `npm run test:debug` ：在一些复杂情况，需要启动 debug 模式，进行断点调试
- `npm run test:watch` ：一般情况，本地开发时，请先用单测来进行基本的开发
