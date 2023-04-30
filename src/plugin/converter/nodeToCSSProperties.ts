import { CSSProperties } from 'react';
import {
  getBackgroundColor,
  getBorderRadius,
  getColor,
  getFlex,
  getHeight,
  getLineHighlight,
  getOverflow,
  getPadding,
  getPosition,
  getWidth,
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
      ...getBackgroundColor(node),
      ...getFlex(node as FrameNode | InstanceNode),
      ...getWidth(node as FrameNode | InstanceNode),
      ...getHeight(node as FrameNode | InstanceNode),
      ...getPadding(node as FrameNode | InstanceNode),
      ...getPosition(node),
      ...getBorderRadius(node),
      ...getOverflow(node),
      ...getColor(node),
      ...getLineHighlight(node),
    };
  }
  return styles;
}
