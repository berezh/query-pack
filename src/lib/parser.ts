import { PackType, ParsedObject, ParsedProperty } from "../interfaces";
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

  private propertyTypes: Record<PackType, string> = {
    string: s.StringProperty,
    number: s.NumberProperty,
    boolean: s.BooleanProperty,
    object: s.ObjectProperty,
    array: s.ArrayProperty,
    null: s.NullProperty,
    undefined: s.UndefinedProperty,
  };

  public version(packed: string): [number | undefined, string] {
    const splits = packed.match(new RegExp(`^[${RT.number32Signs}]`, "g"));
    let ver: number | undefined = undefined;
    let rest = packed;
    if (splits) {
      const v = splits[0];
      ver = Number32.toNumber(v);
      rest = packed.slice(v.length);
      if (rest.match(new RegExp(`^${s.Object}`, "g"))) {
        rest = rest.slice(s.Object.length);
      }
    }

    return [ver, rest];
  }

  public items(packed: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const parts = packed.match(RT.itemSplitReg);
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

  public getType(splitter: string): PackType {
    return Object.keys(this.propertyTypes).find(key => this.propertyTypes[key] === splitter) as PackType;
  }

  public properties(packed: string): ParsedProperty[] {
    const result: ParsedProperty[] = [];
    const parts = packed.split(s.Property);
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

  public objects(packed: string): ParsedObject[] {
    const result: ParsedObject[] = [];
    const contents = packed.split(new RegExp(s.Object));
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
