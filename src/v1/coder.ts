export function encode(input: string): string {
  return encodeURIComponent(input);
}

export function decode(input: string): string {
  return decodeURIComponent(input);
}
