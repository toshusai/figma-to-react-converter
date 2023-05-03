import { toKebabCase } from 'js-convert-case';
import { AvaiableNode } from './AvaiableNode';
import { nodeToCSSProperties } from './nodeToCSSProperties';

export function cssPropsToCss(name: string, node: AvaiableNode) {
  const cssProps = nodeToCSSProperties(node);
  return `.${name} {
        ${Object.entries(cssProps)
          .map(([key, value]) => {
            return `${toKebabCase(key)}: ${value};`;
          })
          .join('\n')}
    }`;
}
