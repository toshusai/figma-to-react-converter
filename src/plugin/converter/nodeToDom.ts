import { Dom } from '../types';
import { nodeToCSSProperties } from './nodeToCSSProperties';
import { toSafeClassName } from '../utils';

export async function nodeToDom(node: SceneNode, isRoot?: boolean) {
  const dom: Dom = {
    tag: 'div',
    attrs: {},
    children: [],
  };

  if (
    node.type === 'FRAME' ||
    node.type === 'INSTANCE' ||
    node.type === 'TEXT' ||
    node.type === 'RECTANGLE' ||
    node.type === 'COMPONENT' ||
    node.type === 'VECTOR'
  ) {
    dom.attrs['class'] = toSafeClassName(node.name);
    if (node.type === 'INSTANCE' && node.mainComponent) {
      dom.attrs['data-type'] = node.type;
      dom.attrs['data-main-component'] = node.mainComponent.parent?.name ?? '';
    }
    if (node.type === 'TEXT') {
      dom.children = [node.characters];
    } else if (node.type === 'VECTOR') {
      const bytes = await node.exportAsync({
        format: 'SVG',
      });
      return {
        tag: 'svg',
        attrs: {},
        meta: {
          bytes: bytes,
        },
        children: [bytes.toLocaleString()],
      };
    } else if (node.type === 'RECTANGLE') {
    } else if (node.children) {
      for (const c of node.children) {
        const d = await nodeToDom(c);
        dom.children?.push(d as any);
      }
    }
    dom.styles = nodeToCSSProperties(node);
  } else {
    dom.tag = 'span';
    dom.attrs['class'] = node.type;
  }

  return dom;
}
