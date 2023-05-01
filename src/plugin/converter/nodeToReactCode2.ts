import { CSSProperties } from 'styled-components';
import { nodeToCSSProperties } from './nodeToCSSProperties';
import { toCamelCase, toKebabCase, toPascalCase } from 'js-convert-case';
export function isChildrenName(name: string) {
  return name.match(/^props\.[a-zA-Z0-9]*(c|C)hildren$/) !== null;
}

export function nodeToReactCode2(node: ComponentSetNode) {
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
  const props = ctx.props.filter((p, i) => ctx.props.findIndex((p2) => p2.name === p.name) === i);

  const componentName = node.name ?? 'Component';

  const src = `
  import React from 'react';
  import styled from 'styled-components';
  ${ctx.imports.join('\n')}
  
  type StyledProps<T> = Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'children' | 'ref'> & {
    ref?: React.Ref<T>;
  };
  
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
  
  `;

  return src;
}

type AvaiableNode = FrameNode | TextNode | InstanceNode | VectorNode | ComponentNode;

type Context = {
  props: Props[];
  styled: string[];
  imports: string[];
};

type Props = {
  name: string;
  type: string;
};

export function nodesToJSX(nodes: AvaiableNode[], ctx: Context) {
  const sameChildrenCount = nodes.every((node) => {
    const sameType = node.type === nodes[0].type;
    if ('children' in node && 'children' in nodes[0]) {
      return sameType && node.children.length === nodes[0].children.length;
    }
    return sameType;
  });
  if (!sameChildrenCount) {
    throw new Error('nodesToJSX: nodes have different children count');
  }

  const mainNode = nodes[0];

  const allStyles = nodes.map((node) => nodeToCSSProperties(node));

  const variantCSSProperties: VariableCSSProperties = {};

  allStyles.forEach((styles, i) => {
    const componnetNode =
      nodes[i].type === 'COMPONENT' ? (nodes[i] as ComponentNode) : findParantConponentNode(nodes[i]);
    if (componnetNode === null) throw new Error('nodesToJSX: componnetNode is null');
    Object.entries(styles).forEach(([cssPropsKey, cssPropsValue]) => {
      if (componnetNode.variantProperties === null) return;

      const key = Object.entries(componnetNode.variantProperties)
        .map(([variantKey, variantValue]) => {
          return `${variantKey}=${variantValue}`;
        })
        .join(',');

      variantCSSProperties[cssPropsKey] = {
        ...variantCSSProperties[cssPropsKey],
        [key]: cssPropsValue,
      };
    });
  });

  if (isChildrenName(mainNode.name)) {
    ctx.props.push({
      name: 'children',
      type: 'React.ReactNode',
    });
    return `{${mainNode.name}}`;
  }

  if (mainNode.type === 'INSTANCE') {
    const attrsString = Object.entries(mainNode.componentProperties)
      .map(([key, value]) => {
        return `${toKebabCase(key.split('#')[0])}="${value.value}"`;
      })
      .join(' ');
    if (!mainNode.mainComponent) throw new Error('nodesToJSX: mainNode.mainComponent is null');

    const mainComponentName = toPascalCase(mainNode.mainComponent.parent?.name.split('#')[0]);
    const propsName = `${toCamelCase(mainComponentName)}Props`;
    ctx.props.push({
      name: propsName,
      type: `Parameters<typeof ${mainComponentName}>[0]`,
    });

    ctx.imports.push(`import {${mainComponentName}} from './${mainComponentName}';`);

    return `<${mainComponentName} {...props.${propsName}} ${attrsString} />`;
  }

  let childrenSrc = '';
  if ('children' in mainNode) {
    for (let i = 0; i < mainNode.children.length; i++) {
      let childrens: SceneNode[] = [];
      nodes.forEach((node) => {
        if ('children' in node) {
          childrens.push(node.children[i]);
        }
      });

      childrenSrc += nodesToJSX(childrens as AvaiableNode[], ctx);
    }
  } else if ('characters' in mainNode) {
    if (mainNode.componentPropertyReferences?.characters) {
      childrenSrc = `{props.${toCamelCase(mainNode.componentPropertyReferences.characters.split('#')[0])}}`;
    } else {
      childrenSrc = mainNode.characters;
    }
  }

  let nodeName = nodeToStyledComponentsName(mainNode);
  const context = {
    keys: [],
  };
  let st = variableCssPropertiesToStyledComponents(mainNode, variantCSSProperties, context);

  ctx.props.push({
    name: toCamelCase(nodeName) + 'Props',
    type: `StyledProps<HTML${toPascalCase(nodeToHtmlElement(mainNode))}Element>`,
  });

  // drop deplicated keys
  const keys = context.keys.filter((x, i, self) => self.indexOf(x) === i);
  if (keys.length > 0) {
    st = st.replace('<PROPS>', `<{${keys.map((key) => `${key}?: string`).join(',')}}>`);
  } else {
    st = st.replace('<PROPS>', '');
  }
  ctx.styled.push(st);

  return `<${nodeName} {...props.${toCamelCase(nodeName) + 'Props'}} ${keys
    .map((key: string) => `${key}={props.${key.replace('$', '')}}`)
    .join('\n')} >${childrenSrc}</${nodeName}>`;
}

type VariableCSSProperties = {
  [key in keyof CSSProperties]: {
    // variantKey=variantValue: cssValue
    [key: string]: string[];
  };
};

function nodeToStyledComponentsName(node: AvaiableNode) {
  let nodeName =
    node.type === 'COMPONENT' ? `Styled${toPascalCase(node.parent?.name)}` : `Styled${toPascalCase(node.name)}`;
  return nodeName;
}

function nodeToHtmlElement(node: AvaiableNode) {
  let name = node.name;
  if (node.type === 'COMPONENT') {
    name = node.parent?.name || '';
  }

  if (name.endsWith('Button')) {
    return 'button';
  }
  return 'div';
}

function variableCssPropertiesToStyledComponents(
  node: AvaiableNode,
  variantCSSProperties: VariableCSSProperties,
  context: {
    keys: string[];
  }
) {
  const name = nodeToStyledComponentsName(node);
  const componentNode = findParantConponentNode(node);
  if (!componentNode) throw new Error('variableCssPropertiesToStyledComponents: componentNode is null');
  return `const ${name} = styled.${nodeToHtmlElement(node)}<PROPS>\`
${Object.entries(variantCSSProperties)
  .map(([cssStyleName, variant2ValueMap]) => {
    const sameValue = Object.values(variant2ValueMap).every((value) => value === Object.values(variant2ValueMap)[0]);
    if (sameValue) {
      return `  ${toKebabCase(cssStyleName)}: ${Object.values(variant2ValueMap)[0]};`;
    } else {
      const sameKeys = Object.keys(variant2ValueMap).every(
        (variant) => variant.split('=')[0] === Object.keys(variant2ValueMap)[0].split('=')[0]
      );
      if (!sameKeys) {
        throw new Error('variableCssPropertiesToStyledComponents: variant2ValueMap has different variantKey');
      }

      return `  ${toKebabCase(cssStyleName)}: \${(props) => {
return ${Object.entries(variant2ValueMap)
        .map(([variant, value]) => {
          const keyValueList = variant.split(',');
          const condition = keyValueList
            .map((keyValue) => {
              const [key, value] = keyValue.split('=');
              context.keys.push('$' + key);
              return `props.$${key} === "${value}"`;
            })
            .join(' && ');

          return `    ${condition} ? "${value}" :`;
        })
        .join('\n')} undefined
}
    };`;
    }
  })
  .join('\n')}
\`
`;
}

function findParantConponentNode(node: SceneNode): ComponentNode | null {
  if (node.type === 'COMPONENT') return node;
  if (node.parent === null) return null;
  if (node.parent.type === 'COMPONENT') {
    return node.parent;
  }
  if ('type' in node.parent) {
    return findParantConponentNode(node.parent as SceneNode);
  }
  return null;
}
