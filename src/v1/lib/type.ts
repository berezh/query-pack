import { AllHandledType, ZipType } from "../interfaces";

export class TypeUtil {
  public static getType(source: unknown): ZipType | undefined {
    if (Array.isArray(source)) {
      return "array";
    }
    if (source === null) {
      return "null";
    }

    switch (typeof source) {
      case "object":
        return "object";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "string":
        return "string";
      case "undefined":
        return "undefined";
    }

    return undefined;
  }

  private static complexTypes: ZipType[] = ["array", "object"];

  private static simpleTypes: ZipType[] = ["number", "boolean", "string"];

  private static emptyTypes: ZipType[] = ["undefined", "null"];

  public static isComplex(type: ZipType): boolean {
    return TypeUtil.complexTypes.includes(type);
  }

  public static isSimple(type: ZipType): boolean {
    return TypeUtil.simpleTypes.includes(type);
  }

  private static complexTypeOrEmpty: AllHandledType[] = ["array", "object", "empty"];

  public static isComplexOrEmpty(type: AllHandledType) {
    return TypeUtil.complexTypeOrEmpty.includes(type);
  }
}
