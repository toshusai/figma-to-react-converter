import { CreateHTMLResponse } from '../types';
import { resetClassNameMap } from '../utils';
import { nodeToReactCode2 } from './nodeToReactCode2';

export async function nodeToResponse(node: SceneNode): Promise<CreateHTMLResponse> {
  resetClassNameMap();
  console.log(node);

  if (node.type === 'COMPONENT_SET') {
    nodeToReactCode2(node);
  } else {
    console.log('not component set', node);
  }
  throw new Error('Not implemented');
}
