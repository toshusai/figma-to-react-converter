import { nodeToResponse } from './converter/nodeToResponse';
import { MessageType } from './types';

figma.showUI(__html__);

figma.ui.resize(512, 512);

export let imageHashBytesList: Record<string, Uint8Array> = {};
figma.ui.onmessage = async (msg) => {
  if (msg.type === MessageType.CREATE_RECTANGLES) {
    const nodes = figma.currentPage.selection;
    const node = nodes[0];

    const res = await nodeToResponse(node);

    figma.ui.postMessage({
      type: MessageType.CREATE_RECTANGLES,
      message: res,
    });
  }
};
