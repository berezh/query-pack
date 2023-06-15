import { ZippedRef, ZippedRefPosition, ZipType, ZipOptions } from "../interfaces";
import { CommonUtil } from "./common";
import { NameConverter } from "./name-converter";
import { ObjectPosition } from "./object-position";
import { Parser } from "./parser";
import { SimpleHandler } from "./simple-handler";
import { TypeUtil } from "./type";
import { UsedSigns } from "./used-signs";

const s = UsedSigns.Splitter;

export class ComplexHandler {
  private simple = new SimpleHandler();

  public static Version = 1;

  private objectPosition = new ObjectPosition();

  private nameConverter: NameConverter;

  private parser = new Parser();

  constructor(options?: ZipOptions) {
    this.nameConverter = new NameConverter(options?.convertor || {});
  }

  private zipSimple(current: ZippedRef, value: unknown, propertyName?: string) {
    const type = TypeUtil.getType(value);
    const simpleResult = this.simple.zip(type, value);
    if (simpleResult) {
      current.children.push({ ...simpleResult, zippedName: propertyName });
    }
  }

  private zipObject(results: ZippedRef[], value: unknown, pos: ZippedRefPosition) {
    const position = this.objectPosition.level(pos);
    const current: ZippedRef = {
      type: "object",
      children: [],
      position,
    };
    results.push(current);

    const objectValue = value as object;

    const keys = Object.keys(objectValue);
    for (let index = 0; index < keys.length; index++) {
      const propName = keys[index];
      const childValue = objectValue[propName];
      const childType = TypeUtil.getType(childValue);
      const p = this.objectPosition.index(position, index);

      const zipName = this.nameConverter.zipName(
        results.filter(x => x.propertyName).map(x => x.propertyName || ""),
        propName
      );
      // this.simple.zip("string", key)?.value || "";

      if (childType === "object") {
        current.children.push({
          propertyName: propName,
          zippedName: zipName,
          type: childType,
          splitter: s.ObjectProperty,
          value: "",
        });
        this.zipObject(results, childValue, p);
      } else if (childType === "array") {
        current.children.push({
          propertyName: propName,
          zippedName: zipName,
          type: childType,
          splitter: s.ArrayProperty,
          value: "",
        });
        this.zipArray(results, childValue, p);
      } else {
        this.zipSimple(current, childValue, zipName);
      }
    }
  }

  private zipArray(results: ZippedRef[], value: unknown, pos: ZippedRefPosition) {
    const position = this.objectPosition.level(pos);
    const current: ZippedRef = {
      type: "array",
      children: [],
      position,
    };

    results.push(current);

    const arrayValue = value as any[];

    for (let index = 0; index < arrayValue.length; index++) {
      const item = arrayValue[index];
      const type = TypeUtil.getType(item);
      const p = this.objectPosition.index(position, index);
      if (type === "object") {
        current.children.push({
          type,
          splitter: s.ObjectProperty,
          value: "",
        });
        this.zipObject(results, item, p);
      } else if (type === "array") {
        current.children.push({
          type,
          splitter: s.ArrayProperty,
          value: "",
        });
        this.zipArray(results, item, p);
      } else {
        this.zipSimple(current, item);
      }
    }
  }

  public zip(source: unknown): string {
    let results: ZippedRef[] = [];

    const type = TypeUtil.getType(source);

    const p = this.objectPosition.reset();
    if (type === "object") {
      this.zipObject(results, source, p);
    } else if (type === "array") {
      this.zipArray(results, source, p);
    } else {
      const current: ZippedRef = {
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
      const propertySplitter = cr.type === "object" ? s.Property : "";
      const complexLine = cr.children
        .map(({ zippedName, splitter, value }) => {
          return (zippedName ? zippedName : "") + splitter + value;
        })
        .join(propertySplitter);

      lines.push(complexLine);
    }

    // when object is one = no splitters
    if (lines.length) {
      lines[0] = ComplexHandler.Version.toString() + lines[0];
    }

    const fullResult = lines.join(s.Object);
    return fullResult;
  }

  public unzip(zipped: string): any {
    const [version, restZipped] = this.parser.version(zipped);
    if ([ComplexHandler.Version].includes(version || 0)) {
      let result: object | undefined = undefined;
      // multi objects
      if (restZipped.match(this.parser.objectReg)) {
        const parsedObjects = this.parser.objects(restZipped);
        if (parsedObjects.length > 0) {
          const root = parsedObjects[0];
          if (TypeUtil.isComplexOrEmpty(root.type)) {
            const realObjects: any[] = [];
            const references: [ZipType, number, string | number, number][] = [];
            let lastRefIndex = -1;
            for (let i = 0; i < parsedObjects.length; i++) {
              const { type, properties } = parsedObjects[i];
              // ARRAY
              if (type === "array") {
                const array: any[] = [];
                for (let propIndex = 0; propIndex < properties.length; propIndex++) {
                  const { splitter, value, type } = properties[propIndex];
                  const itemValue = this.simple.unzip(splitter, value);
                  array.push(itemValue);
                  if (TypeUtil.isComplex(type)) {
                    if (lastRefIndex === -1) {
                      lastRefIndex = i + 1;
                    } else {
                      lastRefIndex++;
                    }
                    references.push([type, i, propIndex, lastRefIndex]);
                  }
                }
                realObjects.push(array);
              }
              // OBJECT
              else if (type === "object") {
                const obj = {};
                for (const { name, splitter, value, type } of properties) {
                  obj[name] = this.simple.unzip(splitter, value);
                  if (TypeUtil.isComplex(type)) {
                    if (lastRefIndex === -1) {
                      lastRefIndex = i + 1;
                    } else {
                      lastRefIndex++;
                    }
                    references.push([type, i, name, lastRefIndex]);
                  }
                }
                realObjects.push(obj);
              } else if (type === "empty") {
                realObjects.push(null);
              }
            }

            for (const [type, containerIndex, index, childIndex] of references) {
              const ref = realObjects[childIndex];
              if (ref === null) {
                realObjects[containerIndex][index] = type === "object" ? {} : [];
              } else {
                realObjects[containerIndex][index] = ref;
              }
            }

            result = realObjects[0];
          }
        }
      }
      // one object
      else if (restZipped.match(this.parser.propertyAllReg)) {
        const props = this.parser.properties(restZipped);
        const obj = {};
        for (const { name, splitter, value } of props) {
          const key = this.simple.unzip<string>(s.StringProperty, name);
          obj[key] = this.simple.unzip(splitter, value);
        }
        result = obj;
      }
      // simple value or array
      else if (restZipped.match(this.parser.itemAllReg)) {
        const ps = this.parser.items(restZipped);
        const values = ps.map(({ splitter, value }) => {
          return this.simple.unzip(splitter, value);
        });
        if (values.length) {
          result = (values.length === 1 ? values[0] : values) as object;
        }
      }

      return result ? this.nameConverter.unzipNames(result) : undefined;
    } else {
      throw Error(`${version} is not supported`);
    }
  }
}
