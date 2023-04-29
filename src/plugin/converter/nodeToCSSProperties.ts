import { CSSProperties } from 'react';
import {
  parseBackgroundColor,
  parseBorderRadius,
  parseColor,
  parseFlex,
  parseHeight,
  parseOverflow,
  parsePadding,
  parsePosition,
  parseWidth,
} from './CSSProperties';
import { isMixed } from '../utils';

export function nodeToCSSProperties(node: SceneNode): CSSProperties {
  let styles: CSSProperties = {};
  if (
    node.type === 'FRAME' ||
    node.type === 'INSTANCE' ||
    node.type === 'TEXT' ||
    node.type === 'RECTANGLE' ||
    node.type === 'COMPONENT'
  ) {
    if (isMixed(node.fills)) {
      return {};
    }
    if ('cornerRadius' in node) {
    }
    styles = {
      ...styles,
      ...parseBackgroundColor(node),
      ...parseFlex(node as FrameNode | InstanceNode),
      ...parseWidth(node as FrameNode | InstanceNode),
      ...parseHeight(node as FrameNode | InstanceNode),
      ...parsePadding(node as FrameNode | InstanceNode),
      ...parsePosition(
        node.layoutPositioning,
        node.constraints,
        node.x,
        node.y,
        node.width,
        node.height,
        node.parent as FrameNode | InstanceNode
      ),
      ...parseBorderRadius(node),
      ...parseOverflow(node),
      ...parseColor(node),
    };
  }
  return styles;
}
