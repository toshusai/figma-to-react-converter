import { CSSProperties } from 'react';
import { rgbColorToHex } from '../../utils/rgbColorToHex';
import { isMixed } from '../../utils/types/isMixed';
import { imageHashMap, promises } from '../global';

export function getBackgroundColor(node: SceneNode): CSSProperties {
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
      const promise = new Promise((resolve, reject) => {
        if (fill.imageHash != null) {
          figma
            .getImageByHash(fill.imageHash)
            ?.getBytesAsync()
            .then((bytes) => {
              if (fill.imageHash == null) {
                reject('fill.imageHash is null');
                return;
              }
              imageHashMap.set(fill.imageHash, bytes);
              resolve(true);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          resolve(true);
        }
      });

      promises.push(promise);

      return {
        backgroundImage: `url(${fill.imageHash})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
  }
  return {};
}
