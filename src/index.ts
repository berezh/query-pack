import { ZipOptions } from "./interfaces";
import { ComplexHandler } from "./handlers/complex-handler";
import { Parser } from "./lib/parser";

export { ZipOptions };

export function zip<T = unknown>(source: T, options?: ZipOptions): string {
  const handler = new ComplexHandler(options);
  const result = handler.zip(source);
  return encodeURIComponent(result);
}

export function unzip<T = any>(zipped: string, options?: ZipOptions): T {
  const decodedInput = decodeURIComponent(zipped);
  const handler = new ComplexHandler(options);
  const result = handler.unzip(decodedInput);
  return result;
}

export function version(zipped: string): number | undefined {
  const [version] = new Parser().version(zipped);
  return version;
}
