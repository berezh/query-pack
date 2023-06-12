import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../used-signs";

const s = UsedSigns.Splitter;
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

  public static p(name: string, value: any, last = false): string {
    let stringValue = "";
    if (typeof value === "string") {
      stringValue = s.StringProperty + this.zipS(value);
    } else if (typeof value === "number") {
      stringValue = s.NumberProperty + this.zipN(value);
    } else if (typeof value === "boolean") {
      stringValue = s.NumberProperty + this.zipB(value);
    }
    return this.zipS(name) + stringValue + (last ? "" : s.Property);
  }

  public static propN(name: string, value: number, last = false): string {
    return this.zipS(name) + s.NumberProperty + this.zipN(value) + (last ? "" : s.Property);
  }

  public static propS(name: string, value: string, last = false): string {
    return this.zipS(name) + s.StringProperty + this.zipS(value) + (last ? "" : s.Property);
  }

  public static propB(name: string, value: boolean, last = false): string {
    return this.zipS(name) + s.BooleanProperty + this.zipB(value) + (last ? "" : s.Property);
  }

  public static r(name: string, last = false): string {
    return this.zipS(name) + s.ReferenceProperty + (last ? "" : s.Property);
  }

  public static obj(last: boolean | string, ...content: string[]): string {
    if (typeof last === "string") {
      content.unshift(last);
    }
    const c = content.join("").replace(new RegExp(`${s.Property}$`, "g"), "");
    return c + (last === true ? "" : s.Object);
  }

  public static full(version: number, ...objects: string[]): string {
    const c = version + objects.join("").replace(new RegExp(`${s.Object}$`, "g"), "");
    return c;
  }

  public static converter(zipper: { zip: (input: unknown) => string; unzip: (z: string) => unknown }) {
    return (source: unknown, zipped: string | (string | number)[], options?: { zip?: boolean; unzip?: boolean }) => {
      const zippedValue = Array.isArray(zipped) ? zipped.join("") : zipped;

      const o = options || { zip: true, unzip: true };

      if (o.zip) {
        expect(zipper.zip(source)).toEqual(zippedValue);
      }
      if (o.unzip) {
        expect(zipper.unzip(zippedValue)).toEqual(source);
      }
    };
  }
}
