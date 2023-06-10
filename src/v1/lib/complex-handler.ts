import { ComplexResult, ZipOptions } from "../interfaces";
import { Parser } from "./parser";
import { SimpleHandler } from "./simple-handler";
import { TypeUtil } from "./type";
import { UsedSigns } from "./used-signs";

export class ComplexHandler {
  private simple = new SimpleHandler();

  public static Version = 1;

  private options: ZipOptions;

  private parser = new Parser();

  constructor(options?: ZipOptions) {
    if (options) {
      this.options = options;
    }
  }

  private zipSimple(current: ComplexResult, value: unknown, propertyName?: string) {
    const type = TypeUtil.getType(value);
    const simpleResult = this.simple.zip(type, value);
    if (simpleResult) {
      current.children.push({ ...simpleResult, propertyName });
    }
  }

  private zipObject(results: ComplexResult[], value: object) {
    const current: ComplexResult = {
      type: "object",
      children: [],
    };
    results.push(current);

    const keys = Object.keys(value);
    for (const key of keys) {
      const childValue = value[key];
      const childType = TypeUtil.getType(childValue);
      const childProperty = this.simple.zip("string", key)?.value || "";
      if (childType === "object") {
        current.children.push({
          propertyName: childProperty,
          type: childType,
          splitter: UsedSigns.Splitter.ObjectProperty,
          value: "",
        });
        this.zipObject(results, childValue);
      } else if (childType === "array") {
        this.zipArray(results, childValue, childProperty);
      } else {
        this.zipSimple(current, childValue, childProperty);
      }
    }
  }

  private zipArray(results: ComplexResult[], obj: object[], propertyName?: string) {
    const current: ComplexResult = {
      propertyName,
      type: "array",
      children: [],
    };

    results.push(current);

    for (const item of obj) {
      const type = TypeUtil.getType(item);
      if (type === "object") {
        current.children.push({
          propertyName: "",
          type,
          splitter: UsedSigns.Splitter.ObjectProperty,
          value: "",
        });
        this.zipObject(results, item);
      } else {
        this.zipSimple(current, item);
      }
    }
  }

  public zip(source: unknown): string {
    const results: ComplexResult[] = [];

    const type = TypeUtil.getType(source);
    if (type === "object") {
      this.zipObject(results, source as object);
    } else if (type === "array") {
      this.zipArray(results, source as object[]);
    } else {
      const current: ComplexResult = {
        type,
        children: [],
      };
      results.push(current);
      this.zipSimple(current, source);
    }

    const lines: string[] = [];

    for (const cr of results) {
      const propertySplitter = cr.type === "object" ? UsedSigns.Splitter.Property : "";
      const complexLine = cr.children
        .map(({ propertyName, splitter, value }) => {
          return (propertyName ? propertyName : "") + splitter + value;
        })
        .join(propertySplitter);

      lines.push(complexLine);
    }

    // when object is one = no splitters
    if (lines.length) {
      lines[0] = ComplexHandler.Version.toString() + lines[0];
    }

    return lines.join(UsedSigns.Splitter.Object);
  }

  public unzip(zipped: string): any {
    const [version, restZipped] = this.parser.version(zipped);
    if ([ComplexHandler.Version].includes(version)) {
      // multi objects
      if (this.parser.objectReg.test(zipped)) {
        const parsedObjects = this.parser.parseObjects(restZipped);
        if (parsedObjects.length > 0) {
          const root = parsedObjects[0];
          if (root.type === "object") {
            const realObjects: any[] = [];
            const references: [number, string, number][] = [];
            let lastRefIndex = -1;
            for (let i = 0; i < parsedObjects.length; i++) {
              const parsedObject = parsedObjects[i];
              const obj = {};
              for (const { name, splitter, value, type } of parsedObject.properties) {
                obj[name] = this.simple.unzip(splitter, value);
                if (type === "object") {
                  if (lastRefIndex === -1) {
                    lastRefIndex = i + 1;
                  } else {
                    lastRefIndex++;
                  }
                  references.push([i, name, lastRefIndex]);
                }
              }

              realObjects.push(obj);
            }

            for (const [containerIndex, name, childIndex] of references) {
              realObjects[containerIndex][name] = realObjects[childIndex];
            }

            return realObjects[0];
          }
        }
      }
      // one object
      else if (this.parser.namedPropertyReg.test(restZipped)) {
        const props = this.parser.parseNamedProperties(restZipped);
        const obj = {};
        for (const { name, splitter, value } of props) {
          obj[name] = this.simple.unzip(splitter, value);
        }
        return obj;
      }
      // simple value or array
      else if (this.parser.propertyTypeReg.test(zipped)) {
        const ps = this.parser.properties(restZipped);
        const values = ps.map(({ splitter, value }) => {
          return this.simple.unzip(splitter, value);
        });
        if (values.length) {
          return values.length === 1 ? values[0] : values;
        }
      }

      return undefined;
    } else {
      throw Error(`${version} is not supported`);
    }
  }
}
