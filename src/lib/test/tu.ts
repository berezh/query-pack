import { ComplexHandler } from "../../handlers/complex-handler";
import { SimpleHandler } from "../../handlers/simple-handler";
import { UsedSigns } from "../used-signs";

const s = UsedSigns.Splitter;
export class TU {
  private static simpleHandler = new SimpleHandler();

  private static splitterValue(value: unknown): string {
    let result = "";
    if (Array.isArray(value)) {
      result = s.ArrayProperty;
    } else if (value === null) {
      result = s.NullProperty;
    } else if (value === undefined) {
      result = s.UndefinedProperty;
    } else if (typeof value === "string") {
      result = s.StringProperty + this.packS(value);
    } else if (typeof value === "number") {
      result = s.NumberProperty + this.packN(value);
    } else if (typeof value === "boolean") {
      result = s.BooleanProperty + this.packB(value);
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

  public static packN(input: number): string {
    return this.simpleHandler.pack("number", input)?.value || "";
  }

  public static packS(input: string): string {
    return this.simpleHandler.pack("string", input)?.value || "";
  }

  public static packB(input: boolean): string {
    return this.simpleHandler.pack("boolean", input)?.value || "";
  }

  public static p(name: string, value: any, last = false): string {
    const stringValue = TU.splitterValue(value);
    const r = this.packS(name) + stringValue + (last ? "" : s.Property);
    return r;
  }

  public static i(value: any): string {
    return TU.splitterValue(value);
  }

  public static propN(name: string, value: number, last = false): string {
    return this.packS(name) + s.NumberProperty + this.packN(value) + (last ? "" : s.Property);
  }

  public static propS(name: string, value: string, last = false): string {
    return this.packS(name) + s.StringProperty + this.packS(value) + (last ? "" : s.Property);
  }

  public static propB(name: string, value: boolean, last = false): string {
    return this.packS(name) + s.BooleanProperty + this.packB(value) + (last ? "" : s.Property);
  }

  public static r(name: string, last = false): string {
    return this.packS(name) + s.ObjectProperty + (last ? "" : s.Property);
  }

  public static a(items: any[]): string {
    let result = "";

    items.forEach(value => {
      result += TU.splitterValue(value);
    });

    return result + s.Object;
  }

  public static obj(...content: string[]): string {
    const c = TU.splitEnd(content.join(""), s.Property);
    return c + s.Object;
  }

  public static full(...contents: string[]): string {
    const c = ComplexHandler.Version + TU.splitEnd(contents.join(""), s.Object, s.Property);
    return c;
  }

  public static converter(packer: { pack: (input: unknown) => string; unpack: (z: string) => unknown }) {
    return (source: unknown, packed: string | (string | number)[], options?: { pack?: boolean; unpack?: boolean }) => {
      const packedValue = Array.isArray(packed) ? packed.join("") : packed;

      const o = options || { pack: true, unpack: true };

      if (o.pack) {
        expect(packer.pack(source)).toEqual(packedValue);
      }
      if (o.unpack) {
        expect(packer.unpack(packedValue)).toEqual(source);
      }
    };
  }
}
