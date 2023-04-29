import { Dom } from '../types';

export function walkDom(dom: Dom, fn: (node: Dom) => void) {
  dom.children?.forEach((child) => {
    walkDom(child, fn);
  });
  fn(dom);
}
