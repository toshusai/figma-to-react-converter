export function isNotSupported(node: SceneNode) {
  if ('children' in node) {
    const hasText = node.children.find((child) => child.type === 'TEXT');
    const hasPadding =
      ('paddingTop' in node && node.paddingTop !== 0) ||
      ('paddingBottom' in node && node.paddingBottom !== 0) ||
      ('paddingLeft' in node && node.paddingLeft !== 0) ||
      ('paddingRight' in node && node.paddingRight !== 0);

    if (hasPadding && hasText && node.children.length > 2) {
      console.warn(`The node ${node.name} has padding and text. This is not supported.`);
    }
  }

  if ('layoutMode' in node) {
    if (node.layoutMode === 'NONE') {
      console.warn(`The node ${node.name} has layoutMode NONE. This is not supported.`);
    }
  }
}
