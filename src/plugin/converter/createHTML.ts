import { nodeToDom } from './nodeToDom';
import { collectImageBytes } from './collectImageBytes';
import { CreateHTMLResponse } from '../types';

export async function createHTML(node: SceneNode): Promise<CreateHTMLResponse> {
  const dom = await nodeToDom(node, true);
  const imageHashBytesList = await collectImageBytes();
  return {
    root: dom,
    imageHashBytesList,
  };
}
