import { CSSProperties } from 'react';
import { getPadding } from './getPadding';

export function getMargin(node: FrameNode | InstanceNode | RectangleNode | TextNode): CSSProperties {
  if (node.type === 'TEXT' && node.parent !== null) {
    if (node.parent.type === 'FRAME' || node.parent.type === 'INSTANCE') {
      const padding = getPadding(node.parent, { isText: true });
      return {
        margin: padding.padding,
        marginTop: padding.paddingTop,
        marginBottom: padding.paddingBottom,
        marginLeft: padding.paddingLeft,
        marginRight: padding.paddingRight,
      };
    }
  }
  return {};
}
