import { CSSProperties } from 'react';
import { isCornerMixin, isRectangleCornerMixin } from '../../utils';

export function parseBorderRadius(node: SceneNode): CSSProperties {
  if (isCornerMixin(node)) {
    if (typeof node.cornerRadius !== 'number') return {};
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
