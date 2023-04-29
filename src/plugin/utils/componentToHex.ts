export function componentToHex(c: number): string {
  const hex = Math.round(c * 255).toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}
