import { CSSProperties } from 'react';

export function parseOverflow(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') return {};
  if (node.type === 'RECTANGLE') return {};
  if (node.type !== 'INSTANCE' && node.type !== 'FRAME' && node.type !== 'COMPONENT') return {};
  if (node.clipsContent) {
    return {
      overflow: 'hidden',
    };
  }
  return {};
}
