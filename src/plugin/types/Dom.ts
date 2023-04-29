import { CSSProperties } from 'react';

export type Dom = {
  tag: string;
  className?: string;
  styles?: CSSProperties;
  children?: Dom[] | string[];
};
