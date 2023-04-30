import { CSSProperties } from 'react';

export type Dom = {
  tag: string;
  attrs: Record<string, string>;
  styles?: CSSProperties;
  children?: Dom[] | string[];
  meta?: any;
};
