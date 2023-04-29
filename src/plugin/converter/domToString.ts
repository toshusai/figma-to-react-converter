import { Dom } from '../types';

export function domToString(dom: Dom | string) {
  if (typeof dom === 'string') {
    return dom;
  }
  const children = dom.children?.map(domToString).join('\n');
  const attrs = {
    class: dom.className,
  };
  const attrsString = Object.entries(attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<${dom.tag} ${attrsString}>${children}</${dom.tag}>`;
}
