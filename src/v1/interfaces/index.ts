export type HandledType = "string" | "number" | "boolean" | "object" | "array";

export interface SimpleResult {
  type: HandledType;
  splitter: string;
  value: string;
}

export interface ComplexPropertyResult extends SimpleResult {
  propertyName: string;
}

export interface ComplexResult {
  type: HandledType;
  children: ComplexPropertyResult[];
}

export interface ZipPropertyConverter extends Record<string, number> {}

export interface ZipConvertor extends Record<string, number | ZipPropertyConverter> {}

export interface ZipOptions {
  convertor: ZipConvertor | ZipConvertor[];
}
