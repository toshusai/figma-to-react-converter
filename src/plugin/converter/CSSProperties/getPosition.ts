import { CSSProperties } from 'react';
import { isRectangleCornerMixin } from '../../utils';

export function getPosition(node: FrameNode | ComponentNode | InstanceNode | RectangleNode | TextNode): CSSProperties {
  let styles: CSSProperties = {};
  if (node.layoutPositioning === 'ABSOLUTE') {
    if (node.constraints.horizontal === 'MIN') {
      styles.left = node.x;
    } else if (node.constraints.horizontal === 'MAX') {
      if (isRectangleCornerMixin(node.parent)) {
        styles.right = node.parent.width - node.x - node.width;
      }
    }

    if (node.constraints.vertical === 'MIN') {
      styles.top = node.y;
    } else if (node.constraints.vertical === 'MAX') {
      if (isRectangleCornerMixin(node.parent)) {
        styles.bottom = node.parent.height - node.y - node.height;
      }
    }

    styles.position = 'absolute';
  } else {
    styles.position = 'relative';
  }

  return styles;
}
