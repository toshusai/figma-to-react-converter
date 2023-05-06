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
  if (node.parent) {
    if ('primaryAxisAlignItems' in node.parent) {
      if (node.parent.primaryAxisAlignItems === 'SPACE_BETWEEN') {
        const index = node.parent.children.findIndex((child) => child.id === node.id);
        if (index !== 0) {
          return {
            marginLeft: 'auto',
          };
        }
      }
    }
  }
  return {};
}
