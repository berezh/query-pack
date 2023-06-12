import { ComplexResult, ComplexResultPosition, ZipOptions } from "../interfaces";
import { CommonUtil } from "./common";
import { ObjectPosition } from "./object-position";
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

  private zipObject(results: ComplexResult[], value: object, pos: ComplexResultPosition) {
    const position = ObjectPosition.level(pos);
    const current: ComplexResult = {
      type: "object",
      children: [],
      position,
    };
    results.push(current);

    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      const childValue = value[key];
      const childType = TypeUtil.getType(childValue);
      const childProperty = this.simple.zip("string", key)?.value || "";
      const p = ObjectPosition.index(position, index);

      if (TypeUtil.isComplex(childType)) {
        current.children.push({
          propertyName: childProperty,
          type: childType,
          splitter: UsedSigns.Splitter.ReferenceProperty,
          value: "",
        });
      }

      if (childType === "object") {
        this.zipObject(results, childValue, p);
      } else if (childType === "array") {
        this.zipArray(results, childValue, childProperty, p);
      } else {
        this.zipSimple(current, childValue, childProperty);
      }
    }
  }

  private zipArray(results: ComplexResult[], obj: object[], propertyName: string | undefined, pos: ComplexResultPosition) {
    const position = ObjectPosition.level(pos);
    const current: ComplexResult = {
      propertyName,
      type: "array",
      children: [],
      position,
    };

    results.push(current);

    for (let index = 0; index < obj.length; index++) {
      const item = obj[index];
      const type = TypeUtil.getType(item);
      const p = ObjectPosition.index(position, index);
      if (TypeUtil.isComplex(type)) {
        current.children.push({
          propertyName: "",
          type,
          splitter: UsedSigns.Splitter.ReferenceProperty,
          value: "",
        });
      }

      if (type === "object") {
        this.zipObject(results, item, p);
      } else if (type === "array") {
        this.zipArray(results, item as [], undefined, p);
      } else {
        this.zipSimple(current, item);
      }
    }
  }

  public zip(source: unknown): string {
    let results: ComplexResult[] = [];

    const type = TypeUtil.getType(source);

    const p = ObjectPosition.create();
    if (type === "object") {
      this.zipObject(results, source as object, p);
    } else if (type === "array") {
      this.zipArray(results, source as object[], undefined, p);
    } else {
      const current: ComplexResult = {
        type,
        children: [],
        position: p,
      };
      results.push(current);
      this.zipSimple(current, source);
    }

    const lines: string[] = [];

    results = CommonUtil.order(results, [x => x.position.itemIndex], [x => x.position.levelIndex], [x => x.position.level]);

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

    const fullResult = lines.join(UsedSigns.Splitter.Object);
    return fullResult;
  }

  public unzip(zipped: string): any {
    const [version, restZipped] = this.parser.version(zipped);
    if ([ComplexHandler.Version].includes(version)) {
      // multi objects
      if (restZipped.match(this.parser.objectReg)) {
        const parsedObjects = this.parser.objects(restZipped);
        if (parsedObjects.length > 0) {
          const root = parsedObjects[0];
          if (root.type === "reference") {
            const realObjects: any[] = [];
            const references: [number, string | number, number][] = [];
            let lastRefIndex = -1;
            for (let i = 0; i < parsedObjects.length; i++) {
              const parsedObject = parsedObjects[i];
              if (parsedObject.isArray) {
                const array: any[] = [];
                for (let propIndex = 0; propIndex < parsedObject.properties.length; propIndex++) {
                  const { splitter, value, type } = parsedObject.properties[i];
                  const itemValue = this.simple.unzip(splitter, value);
                  array.push(itemValue);
                  if (type === "reference") {
                    if (lastRefIndex === -1) {
                      lastRefIndex = i + 1;
                    } else {
                      lastRefIndex++;
                    }
                    references.push([i, propIndex, lastRefIndex]);
                  }
                }
                realObjects.push(array);
              } else {
                const obj = {};
                for (const { name, splitter, value, type } of parsedObject.properties) {
                  obj[name] = this.simple.unzip(splitter, value);
                  if (type === "reference") {
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
            }

            for (const [containerIndex, index, childIndex] of references) {
              realObjects[containerIndex][index] = realObjects[childIndex];
            }

            return realObjects[0];
          }
        }
      }
      // one object
      else if (restZipped.match(this.parser.propertyAllReg)) {
        const props = this.parser.properties(restZipped);
        const obj = {};
        for (const { name, splitter, value } of props) {
          obj[name] = this.simple.unzip(splitter, value);
        }
        return obj;
      }
      // simple value or array
      else if (restZipped.match(this.parser.itemAllReg)) {
        const ps = this.parser.items(restZipped);
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
