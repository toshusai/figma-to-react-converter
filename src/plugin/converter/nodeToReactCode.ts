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

type Props = {
    ${context.props.map((p) => `${p.name}: ${p.type}`).join('\n')}
}

export function Component() {
    return (
        ${jsx}
    )
}
`;

  return src;
}

export function domToJSX(dom: Dom | string, context: Context) {
  if (typeof dom === 'string') {
    if (dom.startsWith(`props.`)) {
      const propsName = dom.replace(`props.`, ``);
      {
        context.props.push({
          name: propsName,
          type: 'string',
        });
      }
      return `{${dom}}`;
    }
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
      }
      return domToJSX(c, context);
    })
    .join('\n');
  const attrsString = Object.entries(dom.attrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  return `<${dom.tag} ${attrsString}>${children}</${dom.tag}>`;
}
