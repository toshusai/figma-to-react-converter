import { CSSProperties } from 'react';

export function getLineHighlight(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') {
    return {
      lineHeight: `${node.height}px`,
    };
  }

  return {};
}
