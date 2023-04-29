/**
 * toKebabCase converts a string to-kebab-case.
 * @param str
 */
export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
