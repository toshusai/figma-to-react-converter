import { imageHashMap } from './CSSProperties/paintToStyle';
import { imageHashBytesList } from '../controller';

export async function collectImageBytes() {
  let promiseList: Promise<void>[] = [];
  imageHashMap.forEach((value, key) => {
    if (value === null) {
      if (imageHashBytesList[key]) return;
      const p = new Promise<void>((resolve) => {
        figma
          .getImageByHash(key)
          ?.getBytesAsync()
          .then((bytes) => {
            imageHashBytesList[key] = bytes;
            resolve();
          });
      });
      promiseList.push(p);
    }
  });
  await Promise.all(promiseList);
  return imageHashBytesList;
}
