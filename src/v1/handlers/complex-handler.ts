import { ZippedRef, ZippedRefPosition, ZipType, ZipOptions } from "../interfaces";
import { CommonUtil } from "../lib/common";
import { ObjectPosition } from "./object-position";
import { Parser } from "../lib/parser";
import { SimpleHandler } from "./simple-handler";
import { TypeUtil } from "../lib/type";
import { UsedSigns } from "../lib/used-signs";
import { ValueConverter } from "../converters/value-converter";
import { FieldConverter } from "../converters/field-converter";

const s = UsedSigns.Splitter;

export class ComplexHandler {
  private simple = new SimpleHandler();

  public static Version = 1;

  private objectPosition = new ObjectPosition();

  private fieldConverter: FieldConverter;

  private valueConverter: ValueConverter;

  private parser = new Parser();

  constructor(options?: ZipOptions) {
    this.fieldConverter = new FieldConverter(options?.fields || {});
    this.valueConverter = new ValueConverter(options?.values || {});
  }

  private zipSimple(current: ZippedRef, zippedName: string | undefined, type: ZipType, value: unknown) {
    const simpleResult = this.simple.zip(type, value);
    if (simpleResult) {
      current.children.push({ ...simpleResult, zippedName });
    }
  }

  private zipObject(references: ZippedRef[], parent: ZippedRef | undefined, propertyName: string | undefined, value: unknown, pos: ZippedRefPosition) {
    const position = this.objectPosition.level(pos);

    const current: ZippedRef = new ZippedRef("object", position, parent, propertyName);
    references.push(current);

    const objectValue = value as object;

    const keys = Object.keys(objectValue);
    for (let index = 0; index < keys.length; index++) {
      const propName = keys[index];
      const childValue = objectValue[propName];
      const type = TypeUtil.getType(childValue);
      const p = this.objectPosition.index(position, index);
      const zipName = this.fieldConverter.zip(current?.rootNames, propName);

      if (type) {
        if (type === "object") {
          current.children.push({
            propertyName: propName,
            zippedName: zipName,
            type: type,
            splitter: s.ObjectProperty,
            value: "",
          });
          this.zipObject(references, current, propName, childValue, p);
        } else if (type === "array") {
          current.children.push({
            propertyName: propName,
            zippedName: zipName,
            type: type,
            splitter: s.ArrayProperty,
            value: "",
          });
          this.zipArray(references, current, propName, childValue, p);
        } else if (type === "null") {
          current.children.push({
            propertyName: propName,
            zippedName: zipName,
            type: type,
            splitter: s.NullProperty,
            value: "",
          });
        } else if (type === "undefined") {
          current.children.push({
            propertyName: propName,
            zippedName: zipName,
            type: type,
            splitter: s.UndefinedProperty,
            value: "",
          });
        } else if (TypeUtil.isSimple(type)) {
          const zipValue = this.valueConverter.zip(current.rootNames, propName, childValue);
          this.zipSimple(current, zipName, type, zipValue);
        }
      }
    }
  }

  private zipArray(references: ZippedRef[], parent: ZippedRef | undefined, propertyName: string | undefined, value: unknown, pos: ZippedRefPosition) {
    const position = this.objectPosition.level(pos);

    const current: ZippedRef = new ZippedRef("array", position, parent, propertyName);
    references.push(current);

    const arrayValue = value as any[];

    for (let index = 0; index < arrayValue.length; index++) {
      const item = arrayValue[index];
      const type = TypeUtil.getType(item);
      const p = this.objectPosition.index(position, index);

      if (type) {
        if (type === "object") {
          current.children.push({
            type,
            splitter: s.ObjectProperty,
            value: "",
          });
          this.zipObject(references, current, undefined, item, p);
        } else if (type === "array") {
          current.children.push({
            type,
            splitter: s.ArrayProperty,
            value: "",
          });
          this.zipArray(references, current, undefined, item, p);
        } else if (type === "undefined") {
          current.children.push({
            type,
            splitter: s.UndefinedProperty,
            value: "",
          });
        } else if (type === "null") {
          current.children.push({
            type,
            splitter: s.NullProperty,
            value: "",
          });
        } else if (TypeUtil.isSimple(type)) {
          this.zipSimple(current, undefined, type, item);
        }
      }
    }
  }

  public zip(source: unknown): string {
    let references: ZippedRef[] = [];
    const lines: string[] = [];

    const type = TypeUtil.getType(source);

    if (type) {
      const p = this.objectPosition.reset();
      if (type === "object") {
        this.zipObject(references, undefined, undefined, source, p);
      } else if (type === "array") {
        this.zipArray(references, undefined, undefined, source, p);
      } else if (TypeUtil.isSimple(type) || TypeUtil.isEmpty(type)) {
        const current: ZippedRef = new ZippedRef(type, p);
        references.push(current);
        if (TypeUtil.isSimple(type)) {
          this.zipSimple(current, undefined, type, source);
        } else if (type === "undefined") {
          current.children.push({
            type,
            splitter: s.UndefinedProperty,
            value: "",
          });
        } else if (type === "null") {
          current.children.push({
            type,
            splitter: s.NullProperty,
            value: "",
          });
        }
      }

      references = CommonUtil.order(references, [x => x.position.itemIndex], [x => x.position.levelIndex], [x => x.position.level]);

      for (const cr of references) {
        const propertySplitter = cr.type === "object" ? s.Property : "";
        const complexLine = cr.children
          .map(({ zippedName, splitter, value }) => {
            return (zippedName ? zippedName : "") + splitter + value;
          })
          .join(propertySplitter);

        lines.push(complexLine);
      }

      if (references.length && lines.length) {
        const firstParsed = references[0];
        if (firstParsed?.type === "object") {
          // when first is object - add object splitter
          lines.unshift(ComplexHandler.Version.toString());
        } else {
          lines[0] = ComplexHandler.Version.toString() + lines[0];
        }
      }
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
            const links: [ZipType, number, string | number, number][] = [];
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
                    links.push([type, i, propIndex, lastRefIndex]);
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
                    links.push([type, i, name, lastRefIndex]);
                  }
                }
                realObjects.push(obj);
              } else if (type === "empty") {
                realObjects.push(null);
              }
            }

            for (const [type, containerIndex, index, childIndex] of links) {
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
      // empty object
      else if (restZipped === "") {
        result = {};
      }

      if (result) {
        result = this.fieldConverter.unzip(result);
        result = this.valueConverter.unzip(result);
      }

      return result;
    } else {
      throw Error(`${version} is not supported`);
    }
  }
}
