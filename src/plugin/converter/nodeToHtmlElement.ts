import { AvaiableNode } from './AvaiableNode';

export function nodeToHtmlElement(node: AvaiableNode) {
  let name = node.name;
  if (node.type === 'COMPONENT') {
    name = node.parent?.name || '';
  }

  if (name.endsWith('Button')) {
    return 'button';
  }
  if (name.endsWith('Image')) {
    return 'img';
  }
  return 'div';
}
