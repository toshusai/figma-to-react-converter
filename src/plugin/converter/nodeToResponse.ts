import { nodeToDom } from './nodeToDom';
import { collectImageBytes } from './collectImageBytes';
import { CreateHTMLResponse } from '../types';
import { resetClassNameMap } from '../utils';

export async function nodeToResponse(node: SceneNode): Promise<CreateHTMLResponse> {
  resetClassNameMap();
  console.log(node);
  const dom = await nodeToDom(node, true);
  if (node.parent?.type === 'COMPONENT_SET') {
    dom.meta = {
      ...dom.meta,
      name: node.parent.name,
    };
  } else {
    dom.meta = {
      ...dom.meta,
      name: node.name,
    };
  }
  const imageHashBytesList = await collectImageBytes();
  return {
    root: dom,
    imageHashBytesList,
  };
}
