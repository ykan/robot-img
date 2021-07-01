import { ImgRect } from './types';

/**
 * 检查两个矩形是否相交
 * @param rect 要检查的矩形
 * @param container 容器矩形
 */
export function intersect(rect: ImgRect, container: ImgRect) {
  const topBottomIn =
    (rect.top >= container.top && rect.top <= container.bottom) || // 图片的上边在区域内
    (rect.top <= container.top && rect.bottom >= container.bottom) || // 图片大于区域
    (rect.bottom >= container.top && rect.bottom <= container.bottom); // 图片的下边在区域内
  const leftRightIn =
    (rect.left >= container.left && rect.left <= container.right) || // 图片的上边在区域内
    (rect.left <= container.left && rect.right >= container.right) || // 图片大于区域
    (rect.right >= container.left && rect.right <= container.right); // 图片的下边在区域内

  return topBottomIn && leftRightIn;
}
