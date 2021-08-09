### 自适应处理图片

图片组件会根据图片的面积自动适应，默认的判断方法：

```ts
function defaultShouldUpdate(newRect: DOMRect, oldRect: DOMRect) {
  // 当 width or height 变大 20% 时，才更新图片
  return newRect.width > oldRect.width * 1.2 || newRect.height > oldRect.height * 1.2
}
```

也可以通过给组件传 `shouldUpdate` 来定义图片是否需要更新，也可以通过

```ts
imgPool.reset({
  globalVars: { shouldUpdate: (newRect, oldRect) => true }
})
```

设置全家默认的 `shouldUpdate` 。
