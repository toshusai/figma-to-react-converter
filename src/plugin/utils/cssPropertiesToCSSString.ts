import { toKebabCase } from 'js-convert-case';
import { CSSProperties } from 'react';

export function cssPropertiesToCSSString(name: string, styles: CSSProperties) {
  const css = Object.entries(styles)
    .map(([key, value]) => `${toKebabCase(key)}: ${value};`)
    .join('\n');
  return `.${name} {\n${css}\n}`;
}
