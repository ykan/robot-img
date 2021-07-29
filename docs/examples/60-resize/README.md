### 自适应处理图片

图片组件会根据图片的面积自动适应，默认的判断方法：

```ts
function defaultShouldUpdate(newRect: DOMRect, oldRect: DOMRect) {
  const newArea = newRect.width * newRect.height
  const oldArea = oldRect.width * oldRect.height

  // 当面积变大 20% 时，才更新图片
  return newArea > oldArea * 1.2
}
```

也可以通过给组件传 `shouldUpdate` 来定义图片是否需要更新


