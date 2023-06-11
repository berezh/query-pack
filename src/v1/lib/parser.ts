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
const s = UsedSigns.Splitter;

function regStartWith(...signs: string[]): string {
  return signs.map(x => `(${x}[^${signs.join()}]+)`).join("|");
}

function regStart(signs: string[]): RegExp {
  return new RegExp(`^[${signs.join()}]`);
}

function regSignValue(signs: string[]): RegExp {
  return new RegExp(signs.map(x => `(${x}[^${signs.join("")}]+)`).join("|"), "g");
}

const simpleSigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty];

class RT {
  private static arrayASigns = [...simpleSigns, s.ObjectProperty];

  private static not(...sings: string[]): string {
    return `[^${sings.join("")}]+`;
  }

  private static notCommon() {
    return RT.not(...simpleSigns, s.Property, s.ArrayProperty, s.ObjectProperty);
  }

  private static any(text: string | string[]): string {
    return `[${Array.isArray(text) ? text.join("") : text}]`;
  }

  private static or(...text: string[]): string {
    return `${text.map(x => `(${x})`).join("|")}`;
  }

  // regex texts
  public static arrayValue = `${s.ArrayProperty}${RT.not(s.ArrayProperty, s.Property)}`;

  public static simpleValue = `[${simpleSigns.join("")}]${RT.notCommon()}`;

  public static nameObject = `${RT.notCommon()}${s.ObjectProperty}`;

  public static simpleNameValue = `${RT.notCommon()}${RT.simpleValue}`;

  public static arrayNameValue = `${RT.notCommon()}${RT.arrayValue}`;

  public static arrayItems = `${RT.any(RT.arrayASigns)}${RT.not(...RT.arrayASigns)}`;

  public static arrayNameValueSplit = RT.or(RT.notCommon(), s.ArrayProperty, RT.arrayItems);

  public static arrayItemSplit = RT.or(RT.not(...RT.arrayASigns), RT.any(RT.arrayASigns), RT.not(...RT.arrayASigns));

  // regex
  public static nameObjectReg = new RegExp(RT.nameObject, "g");

  public static simpleNameValueReg = new RegExp(RT.simpleNameValue, "g");

  public static arrayNameValueReg = new RegExp(RT.arrayNameValue, "g");

  public static arrayNameValueSplitReg = new RegExp(RT.arrayNameValueSplit, "g");

  public static arrayItemsReg = new RegExp(RT.arrayItems, "g");

  public static arrayItemSplitReg = new RegExp(RT.arrayItemSplit, "g");
}

function regNameSignValue(): RegExp {
  const all: string[] = [];
  // const notMatch = `[^${[...simpleSings, ...propertySings, objectSing, arraySing].join("")}]+`;
  // all.push(`(${notMatch}${arraySing}${`[^${arraySing + propertySings}]+`})`);
  // all.push(...simpleSings.map(x => `(${notMatch}${x}${notMatch})`));
  // all.push(`(${notMatch}${objectSing})`);
  all.push(RT.arrayNameValue);
  all.push(RT.simpleNameValue);
  all.push(RT.nameObject);
  return new RegExp(all.map(x => `(${x})`).join("|"), "g");
}

function regMedium(signs: string[]): RegExp {
  const all = signs.join("");
  const motMatch = `[^${all}]+`;
  const match = [motMatch, `[${all}]`, motMatch];
  return new RegExp(match.join("|"), "g");
}

export class Parser {
  public readonly propertySigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty, s.ObjectProperty, s.ArrayProperty];

  public get objectReg(): RegExp {
    return new RegExp(regStartWith(s.Object), "g");
  }

  public get namedPropertyReg(): RegExp {
    return regNameSignValue();
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

  // private match(text: string, regex: RegExp):

  public splitNameSignValue(source: string): string[][] {
    const r: string[][] = [];
    const matches = source.match(this.namedPropertyReg);
    if (matches?.length) {
      for (const matchText of matches) {
        if (matchText.match(RT.arrayNameValue)) {
          const aSplits = matchText.match(RT.arrayNameValueSplitReg);
          if (aSplits && aSplits.length > 2) {
            const [aName, aSplitter, ...items] = aSplits;
            const arrayResult = [aSplitter, aName];
            for (const itemText of items) {
              const splits = itemText.match(RT.arrayItemSplitReg);
              if (splits && splits?.length > 1) {
                arrayResult.push(...[splits[0], splits[1]]);
              }
            }
            r.push(arrayResult);
          }
        } else if (matchText.match(RT.nameObject) || matchText.match(RT.simpleNameValueReg)) {
          const ms = matchText.match(regMedium(this.propertySigns));
          if (ms && ms.length > 1) {
            const mr = [ms[1], ms[0]];
            if (ms[2] !== undefined) {
              mr.push(ms[2]);
            }
            r.push(mr);
          }
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

  public parseObjects(zipped: string): ParsedObject[] {
    const result: ParsedObject[] = [];
    const contents = zipped.split(new RegExp(s.Object));
    for (const content of contents) {
      const parsedObject: ParsedObject = {
        type: "object",
        properties: [...this.parseNamedProperties(content)],
      };

      result.push(parsedObject);
    }

    return result;
  }

  public parseNamedProperties(zipped: string): ParsedNamedProperty[] {
    const result: ParsedNamedProperty[] = [];
    const propertyPairs = this.splitNameSignValue(zipped);
    for (const [name, splitter, value] of propertyPairs) {
      const type = Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as HandledType;
      result.push({
        name,
        splitter,
        type,
        value,
      });
    }
    return result;
  }
}
