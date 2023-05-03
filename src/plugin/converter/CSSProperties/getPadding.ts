import { CSSProperties } from 'react';
import { isChildrenName } from "../isChildrenName";

export function getPadding(
  node: FrameNode | InstanceNode | RectangleNode | TextNode,
  options?: {
    isText?: boolean;
  }
): CSSProperties {
  if (node.type === 'TEXT') return {};
  if (node.type === 'RECTANGLE') return {};

  const hasText = node.children.find((child) => child.type === 'TEXT' && !isChildrenName(child.name));
  if (options?.isText !== true && hasText !== undefined) {
    return {};
  }
  if (
    node.paddingTop === node.paddingBottom &&
    node.paddingTop === node.paddingLeft &&
    node.paddingTop === node.paddingRight
  ) {
    if(node.paddingTop === 0) return {};
    return {
      padding: `${node.paddingTop}px`,
    };
  }
  if (node.paddingTop === node.paddingBottom && node.paddingLeft === node.paddingRight) {
    return {
      padding: `${node.paddingTop}px ${node.paddingRight}px`,
    };
  }
  if (node.paddingTop !== 0 && node.paddingBottom !== 0 && node.paddingLeft !== 0 && node.paddingRight !== 0) {
    return {
      padding: `${node.paddingTop}px ${node.paddingRight}px ${node.paddingBottom}px ${node.paddingLeft}px`,
    };
  }
  let padding: CSSProperties = {};
  if (node.paddingTop !== 0) {
    padding = { ...padding, paddingTop: `${node.paddingTop}px` };
  }
  if (node.paddingBottom !== 0) {
    padding = { ...padding, paddingBottom: `${node.paddingBottom}px` };
  }
  if (node.paddingLeft !== 0) {
    padding = { ...padding, paddingLeft: `${node.paddingLeft}px` };
  }
  if (node.paddingRight !== 0) {
    padding = { ...padding, paddingRight: `${node.paddingRight}px` };
  }
  return padding;
}
