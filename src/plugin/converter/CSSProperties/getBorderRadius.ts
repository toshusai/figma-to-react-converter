import { CSSProperties } from 'react';
import { isCornerMixin, isRectangleCornerMixin } from '../../utils';

export function getBorderRadius(node: SceneNode): CSSProperties {
  if (isCornerMixin(node)) {
    if (typeof node.cornerRadius !== 'number') return {};
    if (node.cornerRadius === 0) return {};
    return {
      borderRadius: `${node.cornerRadius}px`,
    };
  }
  if (isRectangleCornerMixin(node)) {
    return {
      borderRadius: `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`,
    };
  }
  return {};
}
