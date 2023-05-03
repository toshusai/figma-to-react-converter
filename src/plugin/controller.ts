import { nodeToHTML } from './converter/nodeToHTML';
import { nodeToReactCode } from './converter/nodeToReactCode';

figma.showUI(__html__);

figma.ui.resize(512, 512);

export let imageHashBytesList: Record<string, Uint8Array> = {};
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'convert-component') {
    const nodes = figma.currentPage.selection;
    const node = nodes[0];
    if (node.type === 'COMPONENT_SET') {
      const src = nodeToReactCode(node);
      const html = nodeToHTML(node);
      figma.ui.postMessage({
        type: 'convert-component',
        message: {
          src,
          html,
        },
      });
    }
  }
};
