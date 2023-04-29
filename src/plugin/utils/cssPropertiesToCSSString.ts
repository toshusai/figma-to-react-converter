import { CSSProperties } from 'react';
import { toKebabCase } from './toKebabCase';

export function cssPropertiesToCSSString(name: string, styles: CSSProperties) {
  const css = Object.entries(styles)
    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
    .join('\n');
  return `.${name} {\n${css}\n}`;
}
