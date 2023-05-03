import { Context } from './Context';
import { nodeToTag } from './nodeToTag';

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
