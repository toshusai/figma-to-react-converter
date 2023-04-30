export function bytesToUrl(bytes: Uint8Array) {
  const blob = new Blob([Uint8Array.from(bytes)]);
  const url = URL.createObjectURL(blob);
  return url;
}
