export type HandledType = "string" | "number" | "boolean" | "object" | "array";

export type AllHandledType = HandledType | "empty";

export interface SimpleResult {
  type: HandledType;
  splitter: string;
  value: string;
}

export interface ComplexPropertyResult extends SimpleResult {
  propertyName?: string;
}

export interface ComplexResultPosition {
  level: number;
  levelIndex: number;
  itemIndex: number;
}

export interface ComplexResult {
  propertyName?: string;
  type: HandledType;
  children: ComplexPropertyResult[];
  position: ComplexResultPosition;
}

export interface ZipPropertyConverter extends Record<string, number> {}

export interface ZipConvertor extends Record<string, number | ZipPropertyConverter> {}

export interface ZipOptions {
  convertor: ZipConvertor | ZipConvertor[];
}

export interface SignReplace {
  regex: RegExp;
  replace: string;
}
export interface ParsedProperty {
  name: string;
  splitter: string;
  type: HandledType;
  value: string;
}

export interface ParsedObject {
  type: AllHandledType;
  properties: ParsedProperty[];
}
