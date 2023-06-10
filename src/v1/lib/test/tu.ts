import { SimpleHandler } from "../simple-handler";

export class TU {
  private static simpleHandler = new SimpleHandler();

  public static zipN(input: number): string {
    return this.simpleHandler.zip("number", input)?.value || "";
  }

  public static zipS(input: string): string {
    return this.simpleHandler.zip("string", input)?.value || "";
  }

  public static zipB(input: boolean): string {
    return this.simpleHandler.zip("boolean", input)?.value || "";
  }

  public static converter(zipper: { zip: (input: unknown) => string; unzip: (z: string) => unknown }) {
    return (source: unknown, zipped: string | (string | number)[]) => {
      const zippedValue = Array.isArray(zipped) ? zipped.join("") : zipped;
      expect(zipper.zip(source)).toEqual(zippedValue);
      expect(zipper.unzip(zippedValue)).toEqual(source);
    };
  }
}
