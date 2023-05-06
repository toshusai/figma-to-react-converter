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
  if (node.layoutGrow === 1) {
    return {
      height: '100%',
    };
  }
  if (node.layoutMode === 'HORIZONTAL') {
    if (node.counterAxisSizingMode === 'FIXED') {
      return {
        height: `${node.height}px`,
        minHeight: `${node.height}px`,
        maxHeight: `${node.height}px`,
      };
    }
    return {};
  }
  if (node.layoutMode === 'VERTICAL') {
    if (node.primaryAxisSizingMode === 'FIXED') {
      return {
        height: `${node.height}px`,
        minHeight: `${node.height}px`,
        maxHeight: `${node.height}px`,
      };
    }
  }
  return {};
}
