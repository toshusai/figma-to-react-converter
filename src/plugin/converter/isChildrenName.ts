export function isChildrenName(name: string) {
  return name.match(/^props\.[a-zA-Z0-9]*(c|C)hildren$/) !== null;
}
