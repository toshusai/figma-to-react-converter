import { CSSProperties } from 'react';

export function getFontSize(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') {
    return {
      fontSize: typeof node.fontSize === 'number' ? `${node.fontSize}px` : undefined,
    };
  }

  return {};
}
