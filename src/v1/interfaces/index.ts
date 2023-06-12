export type HandledType = "string" | "number" | "boolean" | "object" | "array";

export type ParseType = "string" | "number" | "boolean" | "reference";

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
  index: number;
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
  type: ParseType;
  value: string;
}

export interface ParsedObject {
  type: ParseType;
  isArray?: boolean;
  properties: ParsedProperty[];
}
