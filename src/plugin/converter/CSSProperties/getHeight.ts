import { CSSProperties } from 'react';

export function getHeight(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') return {};
  if (node.type === 'RECTANGLE') {
    return {
      height: `${node.height}px`,
      minHeight: `${node.height}px`,
      maxHeight: `${node.height}px`,
    };
  }
  if (node.type !== 'INSTANCE' && node.type !== 'FRAME' && node.type !== 'COMPONENT') return {};
  if (
    (node.layoutAlign === 'STRETCH' && node.layoutMode === 'VERTICAL') ||
    (node.layoutGrow === 1 && node.layoutMode === 'VERTICAL')
  ) {
    return {
      height: '100%',
    };
  }
  if (
    (node.layoutMode === 'VERTICAL' && node.primaryAxisSizingMode === 'FIXED') ||
    (node.layoutMode === 'HORIZONTAL' && node.counterAxisSizingMode === 'FIXED')
  ) {
    return {
      height: `${node.height}px`,
    };
  }
  return {};
}
