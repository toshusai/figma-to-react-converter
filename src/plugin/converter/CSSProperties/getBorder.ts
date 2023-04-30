import { CSSProperties } from 'react';
import { isMixed, rgbColorToHex } from '../../utils';

export function getBorder(node: SceneNode): CSSProperties {
  if ('strokes' in node) {
    if (isMixed(node.strokes)) return {};
    if (isMixed(node.strokeWeight)) return {};
    if (node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID') {
        return {
          border: `${rgbColorToHex(stroke.color, stroke.opacity)} ${node.strokeWeight}px solid`,
        };
      }
    }
  }

  return {};
}
