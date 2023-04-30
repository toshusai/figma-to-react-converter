import { CSSProperties } from 'react';
import {
  getAlignItems,
  getBackgroundColor,
  getBorder,
  getBorderRadius,
  getColor,
  getFlex,
  getFontSize,
  getHeight,
  getJustifyContent,
  getLineHighlight,
  getMargin,
  getOverflow,
  getPadding,
  getPosition,
  getWidth,
} from './CSSProperties';
import { isMixed } from '../utils';
import { isNotSupported } from './isNotSupported';

export function nodeToCSSProperties(node: SceneNode): CSSProperties {
  isNotSupported(node);
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
      ...getMargin(node as FrameNode | InstanceNode | RectangleNode | TextNode),
      ...getBorder(node),
      ...getFontSize(node),
      ...getAlignItems(node as FrameNode | InstanceNode),
      ...getJustifyContent(node as FrameNode | InstanceNode),
    };

    Object.keys(styles).forEach((key) => styles[key] === undefined && delete styles[key]);
  }
  return styles;
}
