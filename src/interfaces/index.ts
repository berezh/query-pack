export type PackType = "string" | "number" | "boolean" | "object" | "array" | "undefined" | "null";

export type AllHandledType = PackType | "empty";

export const MAX_URL_LENGTH = 2048;

export interface PackedValue {
  type: PackType;
  // todo: use only splitter: remove type
  splitter: string;
  value: string;
}

export interface PackedNamedValue extends PackedValue {
  propertyName?: string;
  packedName?: string;
}

export interface PackedRefPosition {
  level: number;
  levelIndex: number;
  itemIndex: number;
}

export class PackedRef {
  public parent?: PackedRef;

  public propertyName?: string;

  public type: PackType;

  public children: PackedNamedValue[] = [];

  public position: PackedRefPosition;

  constructor(type: PackType, position: PackedRefPosition, parent?: PackedRef, propertyName?: string) {
    this.type = type;
    this.position = position;
    this.parent = parent;
    this.propertyName = propertyName;
  }

  public get rootNames(): string[] {
    const r: string[] = [];
    let p = this as PackedRef | undefined;
    while (!!p) {
      if (p.propertyName) {
        r.unshift(p.propertyName);
      }
      p = p.parent;
    }
    return r;
  }
}

export interface PackFieldConvertor extends Record<string, number | [number, PackFieldConvertor]> {}

export interface PackValueConvertor extends Record<string, string | number | PackValueConvertor> {}

export interface PackOptions {
  fields?: PackFieldConvertor;
  values?: PackValueConvertor;
  includeUndefinedProperty?: boolean;
  maxLength?: number; // 2048
  domainOriginLength?: number;
  ignoreMaxLength?: boolean;
  useOptimizer?: boolean;
}

export interface ParsedProperty {
  name: string;
  splitter: string;
  type: PackType;
  value: string;
}

export interface ParsedObject {
  type: AllHandledType;
  properties: ParsedProperty[];
}
