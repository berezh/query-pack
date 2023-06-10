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

function regSignValue(signs: string[]): RegExp {
  return new RegExp(signs.map(x => `(${x}[^${signs.join("")}]+)`).join("|"), "g");
}

function regNameSignValue(signs: string[], notSings: string[]): RegExp {
  const notMatch = `[^${[...signs, ...notSings].join("")}]+`;
  return new RegExp(signs.map(x => `(${notMatch}${x}${notMatch})`).join("|"), "g");
}

function regMedium(signs: string[]): RegExp {
  const all = signs.join("");
  const motMatch = `[^${all}]+`;
  const match = [motMatch, `[${all}]`, motMatch];
  return new RegExp(match.join("|"), "g");
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

  private splitStart(source: string, sings: string[]): [string, string] | undefined {
    const startMatcher = regStart(sings);
    const ms = source.match(startMatcher);
    if (ms?.length) {
      const mt = ms[0];
      return [mt, source.slice(mt.length)];
    }
  }

  private splitMedium(source: string, sings: string[]): [string, string, string] | undefined {
    const matcher = regMedium(sings);
    const ms = source.match(matcher);
    if (ms && ms.length > 2) {
      return [ms[0], ms[1], ms[2]];
    }
  }

  private splitProperty(source: string): [string, string, string] | undefined {
    const pm = source.match(this.propertyReg);
    if (pm?.length) {
      const rest = source.slice(pm.length);
      const vm = rest.match(this.propertyTypeReg);
      if (vm?.length) {
        const pm = this.splitStart(vm[0], this.propertySigns);
        if (pm) {
          const [sign, value] = pm;
          return [rest.slice(0, rest.length - sign.length - value.length), sign, value];
        }
      }
    }
  }

  public version(zipped: string): [number, string] {
    const splits = this.splitStart(zipped, this.number32Signs);
    if (splits) {
      const [start, rest] = splits;
      return [Number32.toNumber(start), rest];
    } else {
      throw Error("Cannot parse version");
    }
  }

  private splitSignValue(source: string, signs: string[]): [string, string][] {
    const r: [string, string][] = [];
    const matcher = regSignValue(signs);
    const matches = source.match(matcher);
    if (matches?.length) {
      for (const match of matches) {
        const ss = this.splitStart(match, signs);
        if (ss) {
          r.push(ss);
        }
      }
    }
    return r;
  }

  private splitNameSignValue(source: string, signs: string[], notSings: string[]): [string, string, string][] {
    const r: [string, string, string][] = [];
    const matcher = regNameSignValue(signs, notSings);
    const matches = source.match(matcher);
    if (matches?.length) {
      for (const match of matches) {
        const ss = this.splitMedium(match, signs);
        if (ss) {
          r.push(ss);
        }
      }
    }
    return r;
  }

  public properties(zipped: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const pairs = this.splitSignValue(zipped, this.propertySigns);
    for (const [splitter, value] of pairs) {
      const type = Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as HandledType;
      result.push({
        splitter,
        type,
        value,
      });
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
    const objectPairs = this.splitSignValue(zipped, [s.Object]);
    for (const [_k, content] of objectPairs) {
      const parsedObject: ParsedObject = {
        type: "object",
        properties: [],
      };
      const propertyPairs = this.splitNameSignValue(content, this.propertySigns, [s.Property]);
      for (const [name, splitter, value] of propertyPairs) {
        const type = Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as HandledType;
        parsedObject.properties.push({
          name,
          splitter,
          type,
          value,
        });
      }

      result.push(parsedObject);
    }

    return result;
  }
}
