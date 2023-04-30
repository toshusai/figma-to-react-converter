export function isNotSupported(node: SceneNode) {
  if ('children' in node) {
    const hasText = node.children.find((child) => child.type === 'TEXT');
    if (hasText && node.children.length > 1) {
      console.warn(`The node ${node.name} has text and other children. This is not supported.`);
    }
  }

  if ('layoutMode' in node) {
    if (node.layoutMode === 'NONE') {
      console.warn(`The node ${node.name} has layoutMode NONE. This is not supported.`);
    }
  }
}
