import { nodeToHTML } from '../src/plugin/converter/nodeToHTML';

import prettier from 'prettier';
import { Subset } from './utils/Subset';

interface Node {
  parent?: Node;
  children?: Node[];
}

function parent(node: Node) {
  node.children?.forEach((child) => {
    child.parent = node;
    parent(child);
  });
}

const componentSetNode: Subset<ComponentSetNode> = {
  type: 'COMPONENT_SET',
  name: 'Component',
  fills: [],
  children: [
    {
      name: 'Frame',
      type: 'COMPONENT',
      fills: [],
      children: [
        {
          name: 'Text',
          type: 'TEXT',
          characters: 'Hello',
          fills: [
            {
              type: 'SOLID',
              color: {
                r: 1,
                g: 0,
                b: 0,
              },
            },
          ],
        },
      ],
      paddingBottom: undefined,
      paddingLeft: undefined,
      paddingRight: undefined,
      paddingTop: undefined,
    },
  ],
};

test('box', () => {
  parent(componentSetNode as Node);
  const src = nodeToHTML(componentSetNode as ComponentSetNode);

  const out = prettier.format(src, { parser: 'html' });
  expect(out).toEqual(
    `
<div class="StyledComponent"><div class="StyledText">Hello</div></div>
<style>
  .StyledText {
    position: relative;
    color: #ff0000ff;
    margin: undefinedpx;
  }
  .StyledComponent {
    position: relative;
  }
</style>
`.trimStart()
  );
});
