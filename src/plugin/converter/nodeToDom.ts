import { Dom } from '../types';
import { nodeToCSSProperties } from './nodeToCSSProperties';
import { toSafeClassName } from '../utils';

export function isChildrenName(name: string) {
  return name.match(/^props\.[a-zA-Z0-9]*(c|C)hildren$/) !== null;
}

export async function nodeToDom(node: SceneNode, _isRoot?: boolean) {
  const dom: Dom = {
    tag: 'div',
    attrs: {},
    children: [],
    meta: {
      name: node.name,
    },
  };

  if (
    node.type === 'FRAME' ||
    node.type === 'INSTANCE' ||
    node.type === 'TEXT' ||
    node.type === 'RECTANGLE' ||
    node.type === 'COMPONENT' ||
    node.type === 'VECTOR' ||
    node.type === 'COMPONENT_SET'
  ) {
    if (node.name.endsWith('Button')) {
      dom.tag = 'button';
    }
    dom.attrs['class'] = toSafeClassName(node.name);
    if (node.type === 'INSTANCE' && node.mainComponent) {
      dom.attrs['data-type'] = node.type;
      if (node.mainComponent.parent?.type === 'COMPONENT_SET') {
        dom.attrs['data-main-component'] = node.mainComponent.parent.name;
      } else {
        dom.attrs['data-main-component'] = node.mainComponent?.name ?? '';
      }
      Object.keys(node.componentProperties).forEach((key) => {
        dom.attrs[`${key.split('#')[0]}`] = node.componentProperties[key].value.toString();
      });
    }
    if (node.type === 'COMPONENT_SET') {
      dom.meta = {
        variantGroupProperties: node.variantGroupProperties,
      };
    }
    if (node.componentPropertyReferences?.characters) {
      dom.meta = {
        propsText: node.componentPropertyReferences.characters.split('#')[0],
      };
    }
    if (node.componentPropertyReferences?.visible) {
      dom.meta = {
        propsVisible: node.componentPropertyReferences.visible.split('#')[0],
      };
    }
    if (isChildrenName(node.name)) {
      dom.meta = {
        propsChildren: node.name.replace('props.', ''),
      };
    }
    dom.styles = nodeToCSSProperties(node);

    if (node.type === 'TEXT') {
      dom.children = [node.characters];
    } else if (node.type === 'VECTOR') {
      const bytes = await node.exportAsync({
        format: 'SVG',
      });
      return {
        tag: 'svg',
        attrs: {},
        meta: {
          bytes: bytes,
        },
        children: [bytes.toLocaleString()],
      };
    } else if (node.type === 'RECTANGLE') {
    } else if (node.children) {
      for (const c of node.children) {
        const d = await nodeToDom(c);
        dom.children?.push(d as any);
      }
    }
  } else {
    dom.tag = 'span';
    dom.attrs['class'] = node.type;
  }

  return dom;
}
