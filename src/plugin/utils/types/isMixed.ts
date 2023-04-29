export function isMixed(mixed: any): mixed is typeof figma.mixed {
  return mixed === figma.mixed;
}
