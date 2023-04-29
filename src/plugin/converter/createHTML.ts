import { domToString } from './domToString';
import { nodeToDom } from './nodeToDom';
import { collectImageBytes } from './collectImageBytes';
import { cssPropertiesToCSSString, walkDom } from '../utils';
import { CreateHTMLResponse } from '../types';

export async function createHTML(node: SceneNode): Promise<CreateHTMLResponse> {
  console.log(node)
  const dom = nodeToDom(node, true);
  let css = ``;
  walkDom(dom, (node) => {
    if (node.styles) {
      if (node.className) {
        css += cssPropertiesToCSSString(node.className, node.styles);
      }
    }
  });
  const src = `${domToString(dom)}`;
  const imageHashBytesList = await collectImageBytes();
  return {
    src,
    css,
    imageHashBytesList,
  };
}
