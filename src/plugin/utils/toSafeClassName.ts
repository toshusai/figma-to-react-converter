const classNameMap = new Map<string, number>();

export function resetClassNameMap() {
  classNameMap.clear();
}

export function toSafeClassName(name: string) {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '-');
  const count = classNameMap.get(safeName) || 1;
  classNameMap.set(safeName, count + 1);
  if (count === 1) return safeName;
  return `${safeName}-${count}`;
}
