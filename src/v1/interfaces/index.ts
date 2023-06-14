export type ZipType = "string" | "number" | "boolean" | "object" | "array";

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

export interface ZippedRef {
  propertyName?: string;
  type: ZipType;
  children: ZippedNamedValue[];
  position: ZippedRefPosition;
}

export interface ZipConvertor extends Record<string, number | [number, ZipConvertor]> {}

export interface ZipOptions {
  convertor: ZipConvertor;
}

export interface SignReplace {
  regex: RegExp;
  replace: string;
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
