import { HandledType } from "../interfaces";
import { Number32 } from "./number32";
import { UsedSigns } from "./used-signs";

interface ParsedProperty {
  splitter: string;
  type: HandledType;
  value: string;
}

export class Parser {
  private propertySigns = [UsedSigns.Splitter.StringProperty, UsedSigns.Splitter.NumberProperty, UsedSigns.Splitter.BooleanProperty];

  private get propertyReg(): RegExp {
    const text = this.propertySigns.map(x => `(${x}[^${this.propertySigns.join()}]+)`).join("|");
    return new RegExp(text, "g");
  }

  private get propertyTypeReg(): RegExp {
    return new RegExp(`^[${this.propertySigns.join()}]`, "g");
  }

  private get number32Signs(): string {
    return Object.keys(Number32.numbers).join();
  }

  private types: Record<HandledType, string> = {
    string: UsedSigns.Splitter.StringProperty,
    number: UsedSigns.Splitter.NumberProperty,
    boolean: UsedSigns.Splitter.BooleanProperty,
    array: UsedSigns.Splitter.ArrayProperty,
    object: UsedSigns.Splitter.ObjectProperty,
  };

  private splitStart(startMatcher: RegExp, source: string): [string, string] | undefined {
    const ms = source.match(startMatcher);
    if (ms && ms.length) {
      const mt = ms[0];
      return [mt, source.slice(mt.length)];
    }
  }

  public version(zipped: string): [number, string] {
    const splits = this.splitStart(new RegExp(`^[${this.number32Signs}]+`), zipped);
    if (splits) {
      const [start, rest] = splits;
      return [Number32.toNumber(start), rest];
    } else {
      throw Error("Cannot parse version");
    }
  }

  public properties(zipped: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const parts = zipped.match(this.propertyReg);
    if (parts) {
      for (const part of parts) {
        const r = this.splitStart(this.propertyTypeReg, part);
        if (r) {
          const [sign, rest] = r;
          const type = Object.keys(this.types).find(key => this.types[key] === sign) as HandledType;
          result.push({
            splitter: sign,
            type,
            value: rest,
          });
        }
      }
    }

    return result;
  }
}
