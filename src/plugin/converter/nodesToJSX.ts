import { nodeToCSSProperties } from './nodeToCSSProperties';
import { toCamelCase, toKebabCase, toPascalCase } from 'js-convert-case';
import { isChildrenName } from './nodeToReactCode';
import { AvaiableNode } from './AvaiableNode';
import { Context } from './Context';
import { findParantConponentNode } from './findParantConponentNode';
import {
  VariableCSSProperties,
  variableCssPropertiesToStyledComponents,
} from './variableCssPropertiesToStyledComponents';
import { nodeToHtmlElement } from './nodeToHtmlElement';
import { nodeToStyledComponentsName } from './nodeToStyledComponentsName';
import { promises, svgMap } from './nodeToHTML';

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
      .filter(([key, _]) => !key)
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
  } else if (mainNode.type === 'VECTOR') {
    const promise = mainNode.exportAsync({ format: 'SVG' }).then((svg) => {
      svgMap.set(mainNode.id, svg);
    });
    promises.push(promise);
    return `${mainNode.id}`;
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
