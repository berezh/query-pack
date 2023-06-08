import { ZipOptions } from "./interfaces";
import { ComplexHandler } from "./lib/complex-handler";

export function encode(source: unknown, options?: ZipOptions): string {
  const handler = new ComplexHandler(options);
  const result = handler.zip(source);
  return encodeURIComponent(result);
}

export function decode(input: string, options?: ZipOptions): string {
  return decodeURIComponent(input);
}
