import { toKebabCase } from 'js-convert-case';
import { AvaiableNode } from './AvaiableNode';
import { Context } from './Context';
import { nodeToCSSProperties } from './nodeToCSSProperties';
import { nodeToStyledComponentsName } from './nodeToStyledComponentsName';
import { nodeToHtmlElement } from './nodeToHtmlElement';

export function nodeToHTML(node: ComponentSetNode) {
  if (node.children.length == 0) throw new Error('nodeToHTML: node.children.length == 0');
  const mainNode = node.children[0];
  if (mainNode.type !== 'COMPONENT') throw new Error('nodeToHTML: mainNode.type !== "COMPONENT"');

  const ctx: Context = {
    imports: [],
    props: [],
    styled: [],
  };

  let src = nodeToTag(mainNode, ctx);

  return `
${src}
<style>
${ctx.styled.join('\n')}
</style>
`;
}

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

  const tag = nodeToHtmlElement(node);
  return `<${tag} ${attrsString}>${children}</${tag}>`;
}

function cssPropsToCss(name: string, node: AvaiableNode) {
  const cssProps = nodeToCSSProperties(node);
  return `.${name} {
        ${Object.entries(cssProps)
          .map(([key, value]) => {
            return `${toKebabCase(key)}: ${value};`;
          })
          .join('\n')}
    }`;
}
