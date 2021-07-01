export type ImgRect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>;


export interface ImgPoolOptions {
  container?: ImgRect;
}

export interface ImgPool {
  /**
   * 判断图片所在矩形区域与容器区域是否有重叠
   */
  overlap: (rect: ImgRect) => boolean;

  /**
   * 重置设置
   */
  reset: (opts: ImgPoolOptions) => void;
}
