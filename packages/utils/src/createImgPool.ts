import { EventEmitter } from 'events';

import { intersect } from './intersect';
import { ImgPool, ImgPoolOptions } from './types';

export interface ImgItem {
  ref?: HTMLElement;
}

export function createImgPool(opts: ImgPoolOptions): ImgPool {
  const ctx = new EventEmitter();
  const {
    container,
  } = opts;
  const instance: ImgPool = {
    reset() {},
    overlap(rect) {
      if (!container) return false;
      return intersect(rect, container);
    }
  };
  return instance;
}
