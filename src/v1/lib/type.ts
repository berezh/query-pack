import { AllHandledType, ZipType } from "../interfaces";

export class TypeUtil {
  public static getType(source: unknown): ZipType {
    if (Array.isArray(source)) {
      return "array";
    }

    const standardType = typeof source;
    if (standardType === "boolean") {
      return "boolean";
    } else if (standardType === "number") {
      return "number";
    } else if (standardType === "object") {
      return "object";
    }

    return "string";
  }

  private static complexTypes: ZipType[] = ["array", "object"];

  public static isComplex(type: ZipType): boolean {
    return TypeUtil.complexTypes.includes(type);
  }

  private static complexTypeOrEmpty: AllHandledType[] = ["array", "object", "empty"];

  public static isComplexOrEmpty(type: AllHandledType) {
    return TypeUtil.complexTypeOrEmpty.includes(type);
  }
}
