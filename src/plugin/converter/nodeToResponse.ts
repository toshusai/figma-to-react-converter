import { nodeToDom } from './nodeToDom';
import { collectImageBytes } from './collectImageBytes';
import { CreateHTMLResponse } from '../types';

export async function nodeToResponse(node: SceneNode): Promise<CreateHTMLResponse> {
  console.log(node)
  const dom = await nodeToDom(node, true);
  const imageHashBytesList = await collectImageBytes();
  return {
    root: dom,
    imageHashBytesList,
  };
}
