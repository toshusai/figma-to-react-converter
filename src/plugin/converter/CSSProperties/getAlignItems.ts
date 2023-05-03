import { CSSProperties } from 'react';

export function getAlignItems(node: FrameNode | InstanceNode): CSSProperties {
  if (node.layoutMode === 'NONE') return {};
  if (node.layoutMode === 'HORIZONTAL') {
    return {
      alignItems:
        node.counterAxisAlignItems === 'MIN'
          ? undefined
          : node.counterAxisAlignItems === 'CENTER'
          ? 'center'
          : node.counterAxisAlignItems === 'MAX'
          ? 'flex-end'
          : undefined,
    };
  }
  if (node.layoutMode === 'VERTICAL') {
    return {
      alignItems:
        node.counterAxisAlignItems === 'MIN'
          ? undefined
          : node.counterAxisAlignItems === 'CENTER'
          ? 'center'
          : node.counterAxisAlignItems === 'MAX'
          ? 'flex-end'
          : undefined,
    };
  }
  return {};
}
