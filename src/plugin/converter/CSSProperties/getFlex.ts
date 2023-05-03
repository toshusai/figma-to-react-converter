import { CSSProperties } from 'react';

export function getFlex(node: FrameNode | InstanceNode): CSSProperties {
  if (node.layoutMode === 'NONE') return {};
  if (node.layoutMode === 'HORIZONTAL') {
    return {
      display: 'flex',
      // flexDirection: 'row',
      gap: node.itemSpacing !== 0 ? `${node.itemSpacing}px` : undefined,
    };
  }
  if (node.layoutMode === 'VERTICAL') {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: node.itemSpacing !== 0 ? `${node.itemSpacing}px` : undefined,
    };
  }
  return {};
}
