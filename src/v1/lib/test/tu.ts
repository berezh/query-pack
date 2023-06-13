import { ComplexHandler } from "../complex-handler";
import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../used-signs";

const s = UsedSigns.Splitter;
export class TU {
  private static simpleHandler = new SimpleHandler();

  private static splitterValue(value: unknown): string {
    let result = "";
    if (Array.isArray(value)) {
      result = s.ArrayProperty;
    } else if (typeof value === "string") {
      result = s.StringProperty + this.zipS(value);
    } else if (typeof value === "number") {
      result = s.NumberProperty + this.zipN(value);
    } else if (typeof value === "boolean") {
      result = s.BooleanProperty + this.zipB(value);
    } else if (typeof value === "object") {
      result = s.ObjectProperty;
    }

    return result;
  }

  private static splitEnd(input: string, ...sings: string[]): string {
    let result = input;

    sings.forEach(sing => {
      result = result.replace(new RegExp(`${sing}$`, "g"), "");
    });

    return result;
  }

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
    const stringValue = TU.splitterValue(value);
    const r = this.zipS(name) + stringValue + (last ? "" : s.Property);
    return r;
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
    return this.zipS(name) + s.ObjectProperty + (last ? "" : s.Property);
  }

  public static a(items: any[]): string {
    let result = "";

    items.forEach(value => {
      result += TU.splitterValue(value);
    });

    return result + s.Object;
  }

  public static obj(last: boolean | string, ...content: string[]): string {
    if (typeof last === "string") {
      content.unshift(last);
    }
    const c = TU.splitEnd(content.join(""), s.Property);
    return c + (last === true ? "" : s.Object);
  }

  public static full(...objects: string[]): string {
    const c = ComplexHandler.Version + TU.splitEnd(objects.join(""), s.Object, s.Property);
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
