import { nodeToDom } from './nodeToDom';
import { collectImageBytes } from './collectImageBytes';
import { CreateHTMLResponse } from '../types';
import { resetClassNameMap } from '../utils';

export async function nodeToResponse(node: SceneNode): Promise<CreateHTMLResponse> {
  resetClassNameMap();
  const dom = await nodeToDom(node, true);
  dom.meta = {
    name: node.name,
  };
  const imageHashBytesList = await collectImageBytes();
  return {
    root: dom,
    imageHashBytesList,
  };
}
