import { imageHashMap } from './converter/CSSProperties/getBackgroundColor';
import { nodeToHTML, promises, svgMap } from './converter/nodeToHTML';
import { nodeToReactCode } from './converter/nodeToReactCode';

figma.showUI(__html__);

figma.ui.resize(512, 512);

export let imageHashBytesList: Record<string, Uint8Array> = {};
figma.ui.onmessage = async (msg) => {
  promises.splice(0, promises.length);
  if (msg.type === 'convert-component') {
    const nodes = figma.currentPage.selection;
    const node = nodes[0];
    if (node.type === 'COMPONENT_SET') {
      try {
        const src = nodeToReactCode(node);
        const html = nodeToHTML(node);

        await Promise.all(promises);

        figma.ui.postMessage({
          type: 'convert-component',
          message: {
            src,
            html,
            imageHashMap: mapToObj(imageHashMap),
            svgMap: mapToObj(svgMap),
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
};

function mapToObj<T>(map: Map<string, T>): Record<string, T> {
  const obj: Record<string, T> = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}
