import { CSSProperties } from 'react';

export function getLineHighlight(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') {
    return {
      lineHeight: typeof node.fontSize === 'number' ? `${Math.round(node.fontSize * 1.2)}px` : undefined,
    };
  }

  return {};
}
