import { toPascalCase } from 'js-convert-case';
import { AvaiableNode } from './AvaiableNode';

export function nodeToStyledComponentsName(node: AvaiableNode) {
  let nodeName =
    node.type === 'COMPONENT' ? `Styled${toPascalCase(node.parent?.name)}` : `Styled${toPascalCase(node.name)}`;
  return nodeName;
}
