import { handleFigmaMessage } from './handleFigmaMessage';

if (typeof figma !== 'undefined') {
  figma.showUI(__html__);
  figma.ui.resize(512, 512);
  figma.ui.onmessage = handleFigmaMessage;
}
