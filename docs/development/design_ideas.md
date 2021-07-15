# 设计想法

## 基础假设

* 图片组件一定会有对应的 dom 节点，并且在组件的生命周期内是不变的
## 维护一个心跳

如果上一个心跳周期，接收到要检测的消息，那么对仍需检测异步任务进行检测。

但是如果在检测过程中，增加了任务队列怎么办，是否需要继续检测？

## 使用 ResizeObserver

参考：https://groups.google.com/a/chromium.org/g/blink-dev/c/z6ienONUb5A/m/F5-VcUZtBAAJ?pli=1

如果需要兼容，自行引入 'polyfill' ，可以使用：

- [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)
- [@juggle/resize-observer](https://github.com/juggle/resize-observer)

## 维护图片的 Map

## 图片加载的几种情况

前提条件：

> 1. 不处理图片 dom 节点不存在的情况
> 2. 所有图片的 src 都会经过 srcTpl 的处理，但是 defaultSrc 和 errorSrc 由于是特殊的图片不做处理

### 情况一：当 `props.src` 为 `''` 时
