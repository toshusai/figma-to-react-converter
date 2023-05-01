import { CSSProperties } from 'styled-components';
import { Dom } from '../types';
import { toKebabCase } from '../utils';

type Context = {
  props: Props[];

  styled: string[];
};

type Props = {
  name: string;
  type: string;
};

export function nodeToReactCode(dom: Dom) {
  const context: Context = {
    props: [],
    styled: [],
  };
  const jsx = domToJSX(dom, context);

  const componentName = dom.meta?.name ?? 'Component';
  let src = `
import React from 'react';
import styled from 'styled-components';

type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
  ref?: React.Ref<T>;
};

${
  context.props.length > 0
    ? `export type ${componentName}Props = {
    ${context.props.map((p) => `${p.name}: ${p.type}`).join('\n')}
} `
    : ''
}

export function ${componentName}(${context.props.length > 0 ? `props: ${componentName}Props` : ''}) {
    return (
        ${jsx}
    )
}

${context.styled.join('\n')}

`;

  return src;
}

export function domToJSX(dom: Dom | string, context: Context) {
  if (typeof dom === 'string') {
    return dom;
  }
  if (dom.attrs['data-type'] === 'INSTANCE') {
    const mainComponent = dom.attrs['data-main-component'];
    return `<${mainComponent.split(' ')[0]} />`;
  }

  const children = dom.children
    ?.map((c: Dom | string) => {
      if (typeof c !== 'string') {
        if (c.meta?.propsChildren) {
          context.props.push({
            name: c.meta.propsChildren,
            type: 'React.ReactNode',
          });
          return `{props.${c.meta.propsChildren}}`;
        }
        if (c.meta?.propsText) {
          context.props.push({
            name: c.meta.propsText,
            type: 'string',
          });
          c.children = [`{props.${c.meta.propsText}}`];
          return domToJSX(c, context);
        }
        if (c.meta?.propsVisible) {
          context.props.push({
            name: c.meta.propsVisible,
            type: 'boolean',
          });
          return `{props.${c.meta.propsVisible} && (${domToJSX(c, context)})}`;
        }
      }
      return domToJSX(c, context);
    })
    .join('\n');

  let tag = dom.tag;
  const attrsString = Object.entries(dom.attrs)
    .map(([key, value]) => {
      if (key === 'class') {
        key = 'className';
        tag = domToStyledConstName(dom);
        if (dom.styles) {
          context.styled.push(cssPropertiesToStyledComponents(dom.tag, tag, dom.styles));
        }

        const propName = toCamelCase(tag + 'Props');
        context.props.push({
          name: propName + '?',
          type: `StyledProps<HTML${toPascalCase(dom.tag)}Element>`,
        });

        return `{...props.${propName}}`;
      }
      return `${key}="${value}"`;
    })
    .join(' ');

  return `<${tag} ${attrsString}>${children}</${tag}>`;
}

function domToStyledConstName(dom: Dom) {
  if (dom.attrs['class']) {
    return `Styled${toPascalCase(dom.attrs['class'])}`;
  }
  throw new Error('domToStyledConstName: dom.attrs["class"] is undefined');
}

function toCamelCase(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toLowerCase() + s.slice(1))
    .join('');
}

function toPascalCase(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function cssPropertiesToStyledComponents(tag: string, name: string, cssProps: CSSProperties): string {
  return `export const ${name} = styled.${tag}\`
${Object.entries(cssProps)
  .map(([key, value]) => {
    return `  ${toKebabCase(key)}: ${value};`;
  })
  .join('\n')}
\`
`;
}
