import styled, { CSSProperties } from 'styled-components';
import { Dom } from '../types';
import { toKebabCase } from '../utils';

type Context = {
  props: Props[];
  styled: string[];
  imports: string[];
};

type Props = {
  name: string;
  type: string;
};

export function nodeToReactCode(dom: Dom, name?: string, props: Props[] = []) {
  const context: Context = {
    props: props,
    styled: [],
    imports: [],
  };
  const jsx = domToJSX(dom, context);

  const componentName = name ?? dom.meta?.name ?? 'Component';
  const src = `
import React from 'react';
import styled from 'styled-components';
${context.imports.join('\n')}

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
    const mainComponentName = dom.attrs['data-main-component'].split(' ')[0];
    const attrsString = Object.entries(dom.attrs)
      .map(([key, value]) => {
        if (key === 'class') return '';
        if (key === 'data-type' || key === 'data-main-component') {
          return '';
        }
        return `${toKebabCase(key)}="${value}"`;
      })
      .join(' ');
    const propsName = `${toCamelCase(mainComponentName)}Props`;
    context.props.push({
      name: propsName,
      type: `Parameters<typeof ${mainComponentName}>[0]`,
    });

    context.imports.push(`import { ${mainComponentName} } from './${mainComponentName}';`);

    return `<${mainComponentName} {...props.${propsName}} ${attrsString} />`;
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
  return `const ${name} = styled.${tag}\`
${Object.entries(cssProps)
  .map(([key, value]) => {
    return `  ${toKebabCase(key)}: ${value};`;
  })
  .join('\n')}
\`
`;
}

function getDiffLineNumber(srcA: string, srcB: string) {
  const linesA = srcA.split('\n');
  const linesB = srcB.split('\n');
  let i = 0;
  console.log(srcA, srcB);
  for (; i < linesA.length && i < linesB.length; i++) {
    if (linesA[i] !== linesB[i]) {
      console.log('diff', i, linesA[i], linesB[i]);
      break;
    }
  }
  return i;
}

const ExA = styled.div`
  background-color: red;
`;

const ExB = styled.div`
  background-color: blue;
`;

const Merged = styled.div<{ variant: 'A' | 'B' }>`
  ${(props) => {
    switch (props.variant) {
      case 'A':
        return `background-color: red;`;
      case 'B':
        return `background-color: blue;`;
    }
  }}
`;

type VariantSrc = {
  value: string;
  src: string;
};

function mergeCode(variantName: string, baseSrc: string, others: VariantSrc[]) {
  const num = getDiffLineNumber(baseSrc, others[1].src);
  let merged = '';
  baseSrc
    .split('\n')
    .map((line, i) => {
      if (i === num) {
        merged += `  \${(props) => {
        switch (props.${variantName}) {
          ${others
            .map((other) => {
              return `case '${other.value}': return \`${other.src.split('\n')[num]}\``;
            })
            .join(';')}
        }
      }}`;
        return;
      }
    })
    .join('\n');
  return merged;
}

export function handleComponentSet(dom: Dom) {
  let variantGroupProperties = dom.meta.variantGroupProperties as Record<string, { values: string[] }>;
  let src = '';
  const props: Props[] = Object.entries(variantGroupProperties).map(([key, value]) => {
    return {
      name: key,
      type: 'string',
    };
  });

  if (dom.children && dom.children.length > 0 && typeof dom.children[0] !== 'string') {
    dom.children[0].tag = dom.tag;
    dom.children[0].attrs['class'] = dom.tag;
    src = nodeToReactCode(dom.children[0], dom.meta.name, props);
  }
  Object.entries(variantGroupProperties).forEach(([variantName, variantValues]) => {
    const versions: VariantSrc[] = dom.children
      ?.map((c, i) => {
        if (typeof c === 'string') return false;
        for (const variantValue of variantValues.values) {
          if (c.meta?.name.includes(`${variantName}=${variantValue}`)) {
            c.tag = dom.tag;
            c.attrs['class'] = dom.tag;
            const props: Props[] = Object.entries(variantGroupProperties).map(([key, value]) => {
              return {
                name: key,
                type: 'string',
              };
            });
            return {
              value: variantValue,
              src: nodeToReactCode(c, dom.meta.name, props),
            };
          }
        }
        return false;
      })
      .filter((v) => v !== false) as VariantSrc[];
    if (versions.length > 0) {
      src = mergeCode(variantName, src, versions ?? []);
    }
  });
  return src;
}
