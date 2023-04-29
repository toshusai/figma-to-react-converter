import { CSSProperties } from 'react';
import { isMixed, rgbColorToHex } from '../../utils';

export function parseColor(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') {
    if (isMixed(node.fills)) return {};
    if (node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        return {
          color: rgbColorToHex(fill.color, fill.opacity !== undefined ? fill.opacity : 1),
        };
      }
    }
  }

  return {};
}
