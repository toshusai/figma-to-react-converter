import { CSSProperties } from 'styled-components';
import { toKebabCase } from 'js-convert-case';
import { nodeToStyledComponentsName } from './nodeToStyledComponentsName';
import { nodeToHtmlElement } from './nodeToHtmlElement';
import { AvaiableNode } from './AvaiableNode';
import { findParantConponentNode } from './findParantConponentNode';

export type VariableCSSProperties = {
  [key in keyof CSSProperties]: {
    // variantKey=variantValue: cssValue
    [key: string]: string[];
  };
};

export function variableCssPropertiesToStyledComponents(
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
