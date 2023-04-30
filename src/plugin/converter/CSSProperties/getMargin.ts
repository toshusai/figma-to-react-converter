import { CSSProperties } from 'react';
import { getPadding } from './getPadding';

export function getMargin(node: FrameNode | InstanceNode | RectangleNode | TextNode): CSSProperties {
  if (node.type === 'TEXT' && node.parent !== null) {
    if ('paddingTop' in node.parent) {
      const padding = getPadding(node.parent as FrameNode | InstanceNode, { isText: true });
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
