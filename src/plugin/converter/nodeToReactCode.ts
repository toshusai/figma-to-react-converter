import { toCamelCase } from 'js-convert-case';
import { nodesToJSX } from './nodesToJSX';
import { Context } from './Context';

const GENERETED_CODE_COMMENT = `// This code is generated.`;

export function nodeToReactCode(node: ComponentSetNode) {
  const componentNodes: ComponentNode[] = [];
  node.children.forEach((node) => {
    if (node.type === 'COMPONENT') {
      componentNodes.push(node);
    }
  });

  const ctx: Context = {
    props: [],
    styled: [],
    imports: [],
  };

  Object.keys(node.componentPropertyDefinitions).map((key) => {
    ctx.props.push({
      name: toCamelCase(key.split('#')[0]),
      type: 'string',
    });
  });

  const jsx = nodesToJSX(componentNodes, ctx);

  // drop same props name
  const props = ctx.props
    .filter((p, i) => ctx.props.findIndex((p2) => p2.name === p.name) === i)
    .filter((p) => p.name !== '');

  const componentName = node.name ?? 'Component';

  const src = `${GENERETED_CODE_COMMENT}

import React from 'react';
import styled from 'styled-components';
${ctx.imports.join('\n')}


${
  props.length > 0
    ? `export type ${componentName}Props = {
    ${props.map((p) => `${p.name}?: ${p.type}`).join('\n')}
} `
    : ''
}

export function ${componentName}(${ctx.props.length > 0 ? `props: ${componentName}Props` : ''}) {
    return (
        ${jsx}
    )
}

${ctx.styled.join('\n')}

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
    ref?: React.Ref<T>;
};
`;

  return src;
}
