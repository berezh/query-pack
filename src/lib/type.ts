import { AllHandledType, PackType } from "../interfaces";

export class TypeUtil {
  public static getType(source: unknown): PackType | undefined {
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

  private static complexTypes: PackType[] = ["array", "object"];

  private static simpleTypes: PackType[] = ["number", "boolean", "string"];

  private static emptyTypes: PackType[] = ["undefined", "null"];

  public static isComplex(type: PackType): boolean {
    return TypeUtil.complexTypes.includes(type);
  }

  public static isSimple(type: PackType): boolean {
    return TypeUtil.simpleTypes.includes(type);
  }

  public static isEmpty(type: PackType): boolean {
    return TypeUtil.emptyTypes.includes(type);
  }

  private static complexTypeOrEmpty: AllHandledType[] = ["array", "object", "empty"];

  public static isComplexOrEmpty(type: AllHandledType) {
    return TypeUtil.complexTypeOrEmpty.includes(type);
  }
}
