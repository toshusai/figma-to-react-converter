import { AvaiableNode } from './AvaiableNode';
import { Context } from './Context';
import { nodeToStyledComponentsName } from './nodeToStyledComponentsName';
import { nodeToTagName } from './nodeToTagName';
import { promises, svgMap } from './global';
import { cssPropsToCss } from "./cssPropsToCss";

export function nodeToTag(node: AvaiableNode, ctx: Context) {
  let children = '';
  if ('children' in node) {
    children = node.children
      .map((child) => {
        return nodeToTag(child as AvaiableNode, ctx);
      })
      .join('\n');
  } else if (node.type === 'TEXT') {
    children = node.characters;
  } else if (node.type === 'VECTOR') {
    const promise = node.exportAsync({ format: 'SVG' }).then((svg) => {
      svgMap.set(node.id, svg);
    });
    promises.push(promise);
    return `${node.id}`;
  }

  const className = nodeToStyledComponentsName(node);

  const attrs = {
    class: className,
  };

  const attrsString = Object.entries(attrs)
    .map(([key, value]) => {
      return `${key}="${value}"`;
    })
    .join(' ');

  const css = cssPropsToCss(className, node);

  ctx.styled.push(css);

  const tag = nodeToTagName(node);
  if (['img'].includes(tag)) {
    return `<${tag} ${attrsString} />`;
  }
  return `<${tag} ${attrsString}>${children}</${tag}>`;
}
