import { CSSProperties } from 'react';
import { isMixed, rgbColorToHex } from '../../utils';

export function getBorder(node: SceneNode): CSSProperties {
  if ('strokes' in node) {
    if (isMixed(node.strokes)) return {};
    if (node.strokes.length > 0) {
      const stroke = node.strokes[0];
      if (stroke.type === 'SOLID') {
        const color = rgbColorToHex(stroke.color, stroke.opacity);
        return {
          border: isMixed(node.strokeWeight) ? undefined : `${color} ${node.strokeWeight}px solid`,
          borderTop: 'strokeTopWeight' in node ? `${color} ${node.strokeTopWeight}px solid` : undefined,
          borderRight: 'strokeRightWeight' in node ? `${color} ${node.strokeRightWeight}px solid` : undefined,
          borderBottom: 'strokeBottomWeight' in node ? `${color} ${node.strokeBottomWeight}px solid` : undefined,
          borderLeft: 'strokeLeftWeight' in node ? `${color} ${node.strokeLeftWeight}px solid` : undefined,
        };
      }
    }
  }

  return {};
}
