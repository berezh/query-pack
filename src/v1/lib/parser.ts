import { ParseType, ParsedObject, ParsedProperty } from "../interfaces";
import { RT } from "./rt";
import { Number32 } from "./number32";
import { UsedSigns } from "./used-signs";

const s = UsedSigns.Splitter;

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

  public version(zipped: string): [number | undefined, string] {
    const splits = zipped.match(new RegExp(`^[${RT.number32Signs}]`, "g"));
    let ver: number | undefined = undefined;
    let rest = zipped;
    if (splits) {
      const v = splits[0];
      ver = Number32.toNumber(v);
      rest = zipped.slice(v.length);
    }

    return [ver, rest];
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

  public objects(zipped: string): ParsedObject[] {
    const result: ParsedObject[] = [];
    const contents = zipped.split(new RegExp(s.Object));
    for (const content of contents) {
      if (content.match(this.propertyAllReg)) {
        const ref: ParsedObject = {
          type: "reference",
          properties: this.properties(content),
        };
        result.push(ref);
      } else if (content.match(this.itemAllReg)) {
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
