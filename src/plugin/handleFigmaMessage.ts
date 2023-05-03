import { imageHashMap, promises, svgMap } from './converter/global';
import { nodeToHTML } from './converter/nodeToHTML';
import { nodeToReactCode } from './converter/nodeToReactCode';
import { mapToObj } from './utils/mapToObj';

export async function handleFigmaMessage(msg) {
  try {
    if (msg.type === 'convert-component') {
      promises.splice(0, promises.length);
      const nodes = figma.currentPage.selection;
      const node = nodes[0];
      if (node.type === 'COMPONENT_SET') {
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
        figma.ui.postMessage({
          type: 'error',
          message: '',
        });
      } else {
        figma.ui.postMessage({
          type: 'error',
          message: 'Please select a component set',
        });
      }
    }
  } catch (e: any) {
    figma.ui.postMessage({
      type: 'error',
      message: 'toStinrg' in e ? e.toString() : e,
    });
  }
}
