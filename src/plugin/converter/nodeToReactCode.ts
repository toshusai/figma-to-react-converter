import { Dom } from '../types';

type Context = {
  props: Props[];
};

type Props = {
  name: string;
  type: string;
};



export function nodeToReactCode(dom: Dom) {
  const context: Context = {
    props: [],
  };
  const jsx = domToJSX(dom, context);
  let src = `
${context.props.length > 0 ? ` type Props = { ${context.props.map((p) => `${p.name}: ${p.type}`).join('\n')} } ` : ''}

export function Component(${context.props.length > 0 ? 'props: Props' : ''}) {
    return (
        ${jsx}
    )
}
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
        const firstChild = c.children?.[0];
        if (typeof firstChild === 'string') {
          if (firstChild.startsWith(`props.`)) {
            const propsName = firstChild.replace(`props.`, ``);
            if (propsName.toLocaleLowerCase().endsWith('children')) {
              context.props.push({
                name: propsName,
                type: 'React.ReactNode',
              });
              return `{${firstChild}}`;
            }
          }
        }
        if (c.meta.propsText) {
          context.props.push({
            name: c.meta.propsText,
            type: 'string',
          });
          c.children = [`{props.${c.meta.propsText}}`];
          return domToJSX(c, context);
        }
        if (c.meta.propsVisible) {
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
  const attrsString = Object.entries(dom.attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<${dom.tag} ${attrsString}>${children}</${dom.tag}>`;
}
