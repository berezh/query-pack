import { HandledType } from "../interfaces";
import { Number32 } from "./number32";
import { UsedSigns } from "./used-signs";

interface ParsedProperty {
  splitter: string;
  type: HandledType;
  value: string;
}

interface ParsedNamedProperty extends ParsedProperty {
  name: string;
}

interface ParsedObject {
  type: HandledType;
  properties: ParsedNamedProperty[];
}

function regStartWith(...signs: string[]): string {
  return signs.map(x => `(${x}[^${signs.join()}]+)`).join("|");
}

function regStart(signs: string[]): RegExp {
  return new RegExp(`^[${signs.join()}]`);
}

const s = UsedSigns.Splitter;

export class Parser {
  private propertySigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty];

  public get objectReg(): RegExp {
    return new RegExp(regStartWith(s.Object), "g");
  }

  public get propertyReg(): RegExp {
    return new RegExp(regStartWith(s.Property), "g");
  }

  public get propertyTypeReg(): RegExp {
    return new RegExp(regStartWith(...this.propertySigns), "g");
  }

  private get number32Signs(): string[] {
    return Object.keys(Number32.numbers);
  }

  private propertyTypes: Record<HandledType, string> = {
    string: s.StringProperty,
    number: s.NumberProperty,
    boolean: s.BooleanProperty,
    array: s.ArrayProperty,
    object: s.ObjectProperty,
  };

  private splitStart(sings: string[], source: string): [string, string] | undefined {
    const startMatcher = regStart(sings);
    const ms = source.match(startMatcher);
    if (ms?.length) {
      const mt = ms[0];
      return [mt, source.slice(mt.length)];
    }
  }

  private splitProperty(source: string): [string, string, string] | undefined {
    const pm = source.match(this.propertyReg);
    if (pm?.length) {
      const rest = source.slice(pm.length);
      const vm = rest.match(this.propertyTypeReg);
      if (vm?.length) {
        const pm = this.splitStart(this.propertySigns, vm[0]);
        if (pm) {
          const [sign, value] = pm;
          return [rest.slice(0, rest.length - sign.length - value.length), sign, value];
        }
      }
    }
  }

  public version(zipped: string): [number, string] {
    const splits = this.splitStart(this.number32Signs, zipped);
    if (splits) {
      const [start, rest] = splits;
      return [Number32.toNumber(start), rest];
    } else {
      throw Error("Cannot parse version");
    }
  }

  public properties(zipped: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const parts = zipped.match(this.propertyTypeReg);
    if (parts) {
      for (const part of parts) {
        const r = this.splitStart(this.propertySigns, part);
        if (r) {
          const [splitter, value] = r;
          const type = Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as HandledType;
          result.push({
            splitter,
            type,
            value,
          });
        }
      }
    }

    return result;
  }

  public namedProperties(zipped: string): ParsedNamedProperty[] {
    const result: ParsedNamedProperty[] = [];
    const parts = zipped.match(this.propertyReg);
    if (parts) {
      for (const part of parts) {
        const r = this.splitProperty(part);
        if (r) {
          const [name, splitter, value] = r;
          const type = Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as HandledType;
          result.push({
            name,
            splitter,
            type,
            value,
          });
        }
      }
    }

    return result;
  }

  public objects(zipped: string): ParsedObject[] {
    const result: ParsedObject[] = [];
    const parts = zipped.match(this.objectReg);
    if (parts) {
      for (const part of parts) {
        const r = this.splitStart([s.Property], part);
        if (r) {
          const [_s, rest] = r;
          const properties = this.namedProperties(rest);
          result.push({
            type: "object",
            properties,
          });
        }
      }
    }

    return result;
  }
}
