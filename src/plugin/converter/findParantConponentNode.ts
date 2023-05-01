export function findParantConponentNode(node: SceneNode): ComponentNode | null {
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
