import { Dom } from '../types';
import { nodeToCSSProperties } from './nodeToCSSProperties';
import { toSafeClassName } from '../utils';

export function nodeToDom(node: SceneNode, isRoot?: boolean) {
  const dom: Dom = {
    tag: 'div',
    className: 'node',
    children: [],
  };

  if (!isRoot && node.type === 'INSTANCE') {
    dom.tag = node.type;
  } else if (
    node.type === 'FRAME' ||
    node.type === 'INSTANCE' ||
    node.type === 'TEXT' ||
    node.type === 'RECTANGLE' ||
    node.type === 'COMPONENT'
  ) {
    dom.className = toSafeClassName(node.name);
    if (node.type === 'TEXT') {
      dom.children = [node.characters];
    } else if (node.type === 'RECTANGLE') {
    } else {
      dom.children = node.children.map((c) => nodeToDom(c));
    }
    dom.styles = nodeToCSSProperties(node);
  } else {
    dom.tag = 'span';
    dom.className = node.type;
  }

  return dom;
}
