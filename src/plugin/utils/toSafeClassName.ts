const classNameMap = new Map<string, number>();

export function toSafeClassName(name: string) {
  const safeName = name.replace(/[^a-zA-Z0-9]/g, '-');
  const count = classNameMap.get(safeName) || 0;
  classNameMap.set(safeName, count + 1);
  return `${safeName}-${count}`;
}
