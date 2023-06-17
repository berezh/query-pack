export type ZipType = "string" | "number" | "boolean" | "object" | "array" | "undefined" | "null";

export type AllHandledType = ZipType | "empty";

export interface ZippedValue {
  type: ZipType;
  // todo: use only splitter: remove type
  splitter: string;
  value: string;
}

export interface ZippedNamedValue extends ZippedValue {
  propertyName?: string;
  zippedName?: string;
}

export interface ZippedRefPosition {
  level: number;
  levelIndex: number;
  itemIndex: number;
}

export class ZippedRef {
  public parent?: ZippedRef;

  public propertyName?: string;

  public type: ZipType;

  public children: ZippedNamedValue[] = [];

  public position: ZippedRefPosition;

  constructor(type: ZipType, position: ZippedRefPosition, parent?: ZippedRef, propertyName?: string) {
    this.type = type;
    this.position = position;
    this.parent = parent;
    this.propertyName = propertyName;
  }

  public get rootNames(): string[] {
    const r: string[] = [];
    let p = this as ZippedRef | undefined;
    while (!!p) {
      if (p.propertyName) {
        r.unshift(p.propertyName);
      }
      p = p.parent;
    }
    return r;
  }
}

export interface ZipFieldConvertor extends Record<string, number | [number, ZipFieldConvertor]> {}

export interface ZipValueConvertor extends Record<string, string | number | ZipValueConvertor> {}

export interface ZipOptions {
  fields?: ZipFieldConvertor;
  values?: ZipValueConvertor;
  ignoreUndefinedProperty?: boolean;
}

export interface ParsedProperty {
  name: string;
  splitter: string;
  type: ZipType;
  value: string;
}

export interface ParsedObject {
  type: AllHandledType;
  properties: ParsedProperty[];
}
