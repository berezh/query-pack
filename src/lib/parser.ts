import { ZipType, ParsedObject, ParsedProperty } from "../interfaces";
import { RT } from "./rt";
import { Number32 } from "./number32";
import { UsedSigns } from "./used-signs";
import { TypeUtil } from "./type";

const s = UsedSigns.Splitter;

export class Parser {
  public readonly propertySigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty, s.ObjectProperty];

  public get objectReg(): RegExp {
    return new RegExp(s.Object, "g");
  }

  public get propertyAllReg(): RegExp {
    return RT.propertyAllReg;
  }

  public get itemAllReg(): RegExp {
    return RT.itemAllReg;
  }

  private propertyTypes: Record<ZipType, string> = {
    string: s.StringProperty,
    number: s.NumberProperty,
    boolean: s.BooleanProperty,
    object: s.ObjectProperty,
    array: s.ArrayProperty,
    null: s.NullProperty,
    undefined: s.UndefinedProperty,
  };

  public version(zipped: string): [number | undefined, string] {
    const splits = zipped.match(new RegExp(`^[${RT.number32Signs}]`, "g"));
    let ver: number | undefined = undefined;
    let rest = zipped;
    if (splits) {
      const v = splits[0];
      ver = Number32.toNumber(v);
      rest = zipped.slice(v.length);
      if (rest.match(new RegExp(`^${s.Object}`, "g"))) {
        rest = rest.slice(s.Object.length);
      }
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
          if (TypeUtil.isComplex(type)) {
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

  public getType(splitter: string): ZipType {
    return Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as ZipType;
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
        result.push({
          type: "object",
          properties: this.properties(content),
        });
      } else if (content.match(this.itemAllReg)) {
        result.push({
          type: "array",
          properties: this.items(content),
        });
      } else if (content === "") {
        result.push({
          type: "empty",
          properties: [],
        });
      }
    }

    return result;
  }
}
