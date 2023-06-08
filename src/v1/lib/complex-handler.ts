import { ComplexResult, ZipOptions } from "../interfaces";
import { SimpleHandler } from "./simple-handler";
import { TypeUtil } from "./type";
import { UsedSigns } from "./used-signs";

export class ComplexHandler {
  private simple = new SimpleHandler();

  public static Version = 1;

  private options: ZipOptions;

  constructor(options?: ZipOptions) {
    if (options) {
      this.options = options;
    }
  }

  private zipComplex(propertyName: string, value: unknown, current: ComplexResult | undefined, results: ComplexResult[]) {
    const type = TypeUtil.getType(value);
    if (TypeUtil.isComplex(type)) {
      if (type === "object") {
        const obj = value as object;
        const keys = Object.keys(obj);

        if (current) {
          current.children.push({
            propertyName,
            type,
            splitter: UsedSigns.Splitter.ObjectProperty,
            value: "",
          });
        }

        const child: ComplexResult = {
          type,
          children: [],
        };
        results.push(child);

        for (const key of keys) {
          const zippedKey = this.simple.zip("string", key)?.value;
          this.zipComplex(zippedKey || "", obj[key], child, results);
        }
      }
    } else if (type === "array" && current) {
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
    } else if (current) {
      const simpleResult = this.simple.zip(type, value);
      if (simpleResult) {
        current.children.push({ ...simpleResult, propertyName });
      }
    }
  }

  public zip(source: unknown): string {
    const results: ComplexResult[] = [];

    this.zipComplex("", source, undefined, results);

    const lines: string[] = [ComplexHandler.Version.toString()];

    for (const cr of results) {
      const complexLine = cr.children
        .map(({ propertyName, splitter, value }) => {
          return propertyName + splitter + value;
        })
        .join(UsedSigns.Splitter.Property);

      lines.push(complexLine);
    }
    return lines.join(UsedSigns.Splitter.Object);
  }
}
