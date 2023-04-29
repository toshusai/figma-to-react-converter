import { CSSProperties } from 'react';
import { rgbColorToHex } from '../../utils/rgbColorToHex';
import { isMixed } from '../../utils/types/isMixed';

export const imageHashMap = new Map<string, string | null>();

export function parseBackgroundColor(node: SceneNode): CSSProperties {
  if (node.type === 'TEXT') {
    return {};
  }
  if (node.type !== 'RECTANGLE' && node.type !== 'INSTANCE' && node.type !== 'FRAME' && node.type !== 'COMPONENT') {
    return {};
  }
  if (isMixed(node.fills)) return {};
  if (node.fills.length === 0) return {};
  if (node.fills.length === 1) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
      return {
        backgroundColor: rgbColorToHex(fill.color, fill.opacity !== undefined ? fill.opacity : 1),
      };
    } else if (fill.type === 'IMAGE') {
      if (fill.imageHash) {
        if (!imageHashMap.has(fill.imageHash)) {
          imageHashMap.set(fill.imageHash, null);
        }

        return {
          backgroundImage: `url(${fill.imageHash})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
    }
  }
  return {};
}
