import { ParseType, ParsedObject, ParsedProperty } from "../interfaces";
import { Number32 } from "./number32";
import { UsedSigns } from "./used-signs";

const s = UsedSigns.Splitter;

const simpleSigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty];

export class RT {
  private static not(...sings: string[]): string {
    return `[^${sings.join("")}]+`;
  }

  private static notCommon(...sings: string[]) {
    return RT.not(...simpleSigns, s.ReferenceProperty, ...sings);
  }

  private static any(text: string | string[]): string {
    return `[${Array.isArray(text) ? text.join("") : text}]`;
  }

  private static or(...text: string[]): string {
    return `${text.map(x => `(${x})`).join("|")}`;
  }

  private static join(...text: string[]): string {
    return text.join("");
  }

  private static g(...text: string[]): string {
    return `(${text.join("")})`;
  }

  private static oneOrMore(text: string): string {
    return `(${text})+`;
  }

  private static full(text: string): string {
    return `^${text}$`;
  }

  private static maybe(text: string): string {
    return text.length > 1 ? `[${text}]` : `${text}?`;
  }

  private static item = RT.or(RT.join(RT.any(simpleSigns), RT.notCommon()), s.ReferenceProperty);

  private static itemParts = RT.or(RT.any(simpleSigns), RT.notCommon(), s.ReferenceProperty);

  private static simpleProperty = RT.join(RT.notCommon(), RT.any(simpleSigns), RT.notCommon());

  private static referenceProperty = RT.join(RT.notCommon(), s.ReferenceProperty);

  private static propertyParts = RT.or(RT.notCommon(), RT.any(simpleSigns), s.ReferenceProperty, RT.notCommon());

  private static propertyAll = RT.full(RT.oneOrMore(RT.join(RT.g(RT.or(RT.simpleProperty, RT.referenceProperty)), RT.maybe(s.Property))));

  private static itemAll = RT.full(RT.oneOrMore(RT.item));

  private static itemSplit = RT.or(RT.item);

  // PUBLIC

  public static number32Signs = Object.keys(Number32.numbers);

  public static propertyAllReg = new RegExp(RT.propertyAll, "g");

  public static itemAllReg = new RegExp(RT.itemAll, "g");

  public static itemSplitReg = new RegExp(RT.itemSplit, "g");

  public static itemPartsSplitReg = new RegExp(RT.itemParts, "g");

  public static propertyPartsSplitReg = new RegExp(RT.propertyParts, "g");
}

export class Parser {
  public readonly propertySigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty, s.ReferenceProperty];

  public get objectReg(): RegExp {
    return new RegExp(s.Object, "g");
  }

  public get propertyAllReg(): RegExp {
    return RT.propertyAllReg;
  }

  public get itemAllReg(): RegExp {
    return RT.itemAllReg;
  }

  private propertyTypes: Record<ParseType, string> = {
    string: s.StringProperty,
    number: s.NumberProperty,
    boolean: s.BooleanProperty,
    reference: s.ReferenceProperty,
  };

  public version(zipped: string): [number, string] {
    const splits = zipped.match(new RegExp(`^[${RT.number32Signs}]`, "g"));
    if (splits) {
      const v = splits[0];
      return [Number32.toNumber(v), zipped.slice(v.length)];
    } else {
      throw Error("Cannot parse version");
    }
  }

  public items(zipped: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const parts = zipped.match(RT.itemSplitReg);
    if (parts) {
      for (const part of parts) {
        const splits = part.match(RT.itemPartsSplitReg);
        if (splits) {
          const splitter = splits[0];
          const type = this.getType(splitter);
          if (splitter === s.ReferenceProperty) {
            result.push({
              splitter,
              type,
              value: "",
              name: "",
            });
          } else {
            result.push({
              splitter,
              type,
              value: splits[1],
              name: "",
            });
          }
        }
      }
    }

    return result;
  }

  public getType(splitter: string): ParseType {
    return Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as ParseType;
  }

  public properties(zipped: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const parts = zipped.split(s.Property);
    if (parts) {
      for (const part of parts) {
        const splits = part.match(RT.propertyPartsSplitReg);
        if (splits) {
          const [name, splitter, value] = splits;
          result.push({
            name,
            splitter,
            type: this.getType(splitter),
            value: value || "",
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
      if (this.propertyAllReg.test(content)) {
        const ref: ParsedObject = {
          type: "reference",
          properties: this.properties(content),
        };
        result.push(ref);
      } else if (this.itemAllReg.test(content)) {
        const ref: ParsedObject = {
          isArray: true,
          type: "reference",
          properties: this.items(content),
        };
        result.push(ref);
      }
    }

    return result;
  }
}
