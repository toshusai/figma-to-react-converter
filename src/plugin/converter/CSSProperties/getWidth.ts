import { CSSProperties } from 'react';

export function getWidth(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') return {};
  if (node.type === 'RECTANGLE') {
    return {
      width: `${node.width}px`,
      minWidth: `${node.width}px`,
      maxWidth: `${node.width}px`,
    };
  }
  if (node.type !== 'INSTANCE' && node.type !== 'FRAME' && node.type !== 'COMPONENT') return {};
  if (node.layoutAlign === 'STRETCH' && node.primaryAxisSizingMode != 'AUTO') {
    return {
      width: '100%',
    };
  }
  if (node.layoutMode === 'HORIZONTAL') {
    if (node.primaryAxisSizingMode === 'FIXED') {
      return {
        width: `${node.width}px`,
        minWidth: `${node.width}px`,
        maxWidth: `${node.width}px`,
      };
    }
  }
  if (node.layoutMode === 'VERTICAL') {
    if (node.counterAxisSizingMode === 'FIXED') {
      return {
        width: `${node.width}px`,
        minWidth: `${node.width}px`,
        maxWidth: `${node.width}px`,
      };
    }
    return {};
  }
  return {};
}
