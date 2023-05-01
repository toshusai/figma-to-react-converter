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
  let src = `
${
  context.props.length > 0
    ? ` type Props = {
    ${context.props.map((p) => `${p.name}: ${p.type}`).join('\n')}
} `
    : ''
}

export function Component(${context.props.length > 0 ? 'props: Props' : ''}) {
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
          context.styled.push(cssPropertiesToStyledComponents(tag, dom.styles));
        }
        return;
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

function toPascalCase(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function cssPropertiesToStyledComponents(name: string, cssProps: CSSProperties): string {
  return `export const ${name} = styled.div\`
${Object.entries(cssProps)
  .map(([key, value]) => {
    return `  ${toKebabCase(key)}: ${value};`;
  })
  .join('\n')}
\`
`;
}
