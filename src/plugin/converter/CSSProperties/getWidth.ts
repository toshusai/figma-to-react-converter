import { CSSProperties } from 'react';

export function getWidth(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') return {};
  if (node.type === 'RECTANGLE') {
    return {
      width: `${node.width}px`,
    };
  }
  if (node.type !== 'INSTANCE' && node.type !== 'FRAME' && node.type !== 'COMPONENT') return {};
  if (node.layoutAlign === 'STRETCH' && node.layoutMode === 'HORIZONTAL') {
    return {
      width: '100%',
    };
  }
  if (
    (node.layoutMode === 'HORIZONTAL' && node.primaryAxisSizingMode === 'FIXED') ||
    (node.layoutMode === 'VERTICAL' && node.counterAxisSizingMode === 'FIXED')
  ) {
    return {
      width: `${node.width}px`,
    };
  }
  return {};
}
