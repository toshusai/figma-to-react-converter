import { CSSProperties } from 'react';


export function parsePosition(
  layoutPositioning: LayoutMixin['layoutPositioning'],
  constraints: ConstraintMixin['constraints'],
  x: number,
  y: number,
  width: number,
  height: number,
  parent: FrameNode | InstanceNode | null = null
): CSSProperties {
  let styles: CSSProperties = {};
  if (layoutPositioning === 'ABSOLUTE') {
    if (constraints.horizontal === 'MIN') {
      styles.left = x;
    } else if (constraints.horizontal === 'MAX') {
      styles.right = parent ? parent.width - x - width : x;
    }

    if (constraints.vertical === 'MIN') {
      styles.top = y;
    } else if (constraints.vertical === 'MAX') {
      styles.bottom = parent ? parent.height - y - height : y;
    }

    styles.position = 'absolute';
  } else {
    styles.position = 'relative';
  }

  return styles;
}
