import { ComplexHandler } from "./lib/complex-handler";

export function zip(source: unknown): string {
  const handler = new ComplexHandler();
  const result = handler.zip(source);
  return encodeURIComponent(result);
}

export function unzip(input: string): string {
  const decodedInput = decodeURIComponent(input);
  const handler = new ComplexHandler();
  const result = handler.zip(decodedInput);
  return result;
}
