import { CSSProperties } from 'react';

export function getJustifyContent(node: FrameNode | InstanceNode): CSSProperties {
  if (node.layoutMode === 'NONE') return {};
  if (node.layoutMode === 'HORIZONTAL') {
    return {
      justifyContent:
        node.primaryAxisAlignItems === 'MIN'
          ? undefined
          : node.primaryAxisAlignItems === 'CENTER'
          ? 'center'
          : node.primaryAxisAlignItems === 'MAX'
          ? 'flex-end'
          : undefined,
    };
  }
  if (node.layoutMode === 'VERTICAL') {
    return {
      justifyContent:
        node.primaryAxisAlignItems === 'MIN'
          ? undefined
          : node.primaryAxisAlignItems === 'CENTER'
          ? 'center'
          : node.primaryAxisAlignItems === 'MAX'
          ? 'flex-end'
          : undefined,
    };
  }
  return {};
}
