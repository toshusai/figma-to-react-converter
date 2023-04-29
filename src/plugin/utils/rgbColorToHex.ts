import { componentToHex } from './componentToHex';

export function rgbColorToHex(rgb: RGB, a?: number): string {
  return '#' + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b) + componentToHex(a ?? 1);
}
