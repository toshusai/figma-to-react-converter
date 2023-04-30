import { Dom } from './Dom';

export type CreateHTMLResponse = {
  root: Dom;
  imageHashBytesList: Record<string, Uint8Array>;
};
