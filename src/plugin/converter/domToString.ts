import { Dom } from '../types';

export function domToString(dom: Dom | string) {
  if (typeof dom === 'string') {
    return dom;
  }
  if (dom.tag === 'svg') {
    const bytes: Uint8Array = dom.meta.bytes;
    const svg = new TextDecoder().decode(bytes);
    return svg;
  }
  const children = dom.children?.map(domToString).join('\n');
  const attrsString = Object.entries(dom.attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<${dom.tag} ${attrsString}>\n${children}\n</${dom.tag}>`;
}
