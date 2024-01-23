import { ComplexHandler } from "./handlers/complex-handler";
import { MAX_URL_LENGTH, PackOptions, PackFieldConvertor, PackValueConvertor } from "./interfaces";
import { Parser } from "./lib/parser";

export { PackOptions, PackFieldConvertor, PackValueConvertor };

export function encode<T = unknown>(source: T, options?: PackOptions): string {
  const handler = new ComplexHandler(options);
  const result = handler.zip(source);
  return encodeURIComponent(result);
}

export function decode<T = any>(zipped: string, options?: PackOptions): T {
  const decodedInput = decodeURIComponent(zipped);
  const handler = new ComplexHandler(options);
  const result = handler.unzip(decodedInput);
  return result;
}

export function version(zipped: string): number | undefined {
  const [version] = new Parser().version(zipped);
  return version;
}

export function verifyLength(
  encodedString: string,
  options?: {
    maxLength?: number; // 2048
    domainOriginLength?: number;
  }
): boolean {
  const { maxLength = MAX_URL_LENGTH, domainOriginLength = 0 } = options || {};
  return encodedString?.length + domainOriginLength <= maxLength;
}
