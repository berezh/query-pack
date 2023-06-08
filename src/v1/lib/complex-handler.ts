import { ComplexResult, ZipOptions } from "../interfaces";
import { SimpleHandler } from "./simple-handler";
import { TypeUtil } from "./type";
import { UsedSigns } from "./used-signs";

export class ComplexHandler {
  private simple = new SimpleHandler();

  private options: ZipOptions;

  constructor(options?: ZipOptions) {
    if (options) {
      this.options = options;
    }
  }

  private zipComplex(propertyName: string, value: unknown, current: ComplexResult, results: ComplexResult[]) {
    const type = TypeUtil.getType(value);
    if (TypeUtil.isComplex(type)) {
      if (type === "object") {
        const obj = value as object;
        const keys = Object.keys(obj);

        current.children.push({
          propertyName,
          type,
          splitter: UsedSigns.Splitter.ObjectProperty,
          value: "",
        });

        const child: ComplexResult = {
          type,
          children: [],
        };
        results.push(child);

        for (const key of keys) {
          this.zipComplex(key, obj[key], child, results);
        }
      }
    } else if (type === "array") {
      current.children.push({
        propertyName,
        type,
        splitter: UsedSigns.Splitter.ArrayProperty,
        value: "",
      });
      const child: ComplexResult = {
        type,
        children: [],
      };
      results.push(child);

      for (const itemValue of value as any[]) {
        this.zipComplex(propertyName, itemValue, child, results);
      }
    } else {
      const simpleResult = this.simple.zip(type, value);
      if (simpleResult) {
        current.children.push({ ...simpleResult, propertyName });
      }
    }
  }

  public zip(source: unknown): string {
    const root: ComplexResult = {
      type: TypeUtil.getType(source),
      children: [],
    };
    const results: ComplexResult[] = [root];

    this.zipComplex("", source, root, results);

    return "";
  }
}
