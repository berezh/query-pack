import { PackedRef, PackedRefPosition, PackType, PackOptions, MAX_URL_LENGTH } from "../interfaces";
import { CommonUtil } from "../lib/common";
import { ObjectPosition } from "../utils/object-position";
import { Parser } from "../lib/parser";
import { SimpleHandler } from "./simple-handler";
import { TypeUtil } from "../lib/type";
import { UsedSigns } from "../lib/used-signs";
import { ValueConverter } from "../converters/value-converter";
import { FieldConverter } from "../converters/field-converter";
import { QpError } from "../lib/error";
import { QpErrorCode } from "../lib/error/code";
import { ArrayOptimizer } from "../optimizers/array";

const s = UsedSigns.Splitter;

export class ComplexHandler {
  private simple = new SimpleHandler();

  public static Version = 1;

  private objectPosition = new ObjectPosition();

  private fieldConverter: FieldConverter;

  private valueConverter: ValueConverter;

  private arrayOptimizer = new ArrayOptimizer();

  private includeUndefinedProperty = false;

  private maxLength = MAX_URL_LENGTH;

  private domainOriginLength = 0;

  private ignoreMaxLength = false;

  private useOptimizer = true;

  private parser = new Parser();

  constructor(options?: PackOptions) {
    this.fieldConverter = new FieldConverter(options?.fields || {});
    this.valueConverter = new ValueConverter(options?.values || {});

    if (typeof options?.includeUndefinedProperty === "boolean") {
      this.includeUndefinedProperty = options?.includeUndefinedProperty;
    }
    if (typeof options?.ignoreMaxLength === "boolean") {
      this.ignoreMaxLength = options?.ignoreMaxLength;
    }
    if (typeof options?.useOptimizer === "boolean") {
      this.useOptimizer = options?.useOptimizer;
    }
    if (typeof options?.maxLength === "boolean") {
      this.maxLength = options?.maxLength;
    }
    if (typeof options?.domainOriginLength === "boolean") {
      this.domainOriginLength = options?.domainOriginLength;
    }
  }

  private packSimple(current: PackedRef, packedName: string | undefined, type: PackType, value: unknown) {
    const simpleResult = this.simple.pack(type, value);
    if (simpleResult) {
      current.children.push({ ...simpleResult, packedName: packedName });
    }
  }

  private packObject(references: PackedRef[], parent: PackedRef | undefined, propertyName: string | undefined, value: unknown, pos: PackedRefPosition) {
    const position = this.objectPosition.level(pos);

    const current: PackedRef = new PackedRef("object", position, parent, propertyName);
    references.push(current);

    const objectValue = value as object;

    const keys = Object.keys(objectValue);
    for (let index = 0; index < keys.length; index++) {
      const propName = keys[index];
      const childValue = objectValue[propName];
      const type = TypeUtil.getType(childValue);
      const p = this.objectPosition.index(position, index);
      const packName = this.fieldConverter.pack(current?.rootNames, propName);

      if (type) {
        if (type === "object") {
          current.children.push({
            propertyName: propName,
            packedName: packName,
            type: type,
            splitter: s.ObjectProperty,
            value: "",
          });
          this.packObject(references, current, propName, childValue, p);
        } else if (type === "array") {
          current.children.push({
            propertyName: propName,
            packedName: packName,
            type: type,
            splitter: s.ArrayProperty,
            value: "",
          });
          this.packArray(references, current, propName, childValue, p);
        } else if (type === "null") {
          current.children.push({
            propertyName: propName,
            packedName: packName,
            type: type,
            splitter: s.NullProperty,
            value: "",
          });
        } else if (type === "undefined") {
          if (this.includeUndefinedProperty) {
            current.children.push({
              propertyName: propName,
              packedName: packName,
              type: type,
              splitter: s.UndefinedProperty,
              value: "",
            });
          }
        } else if (TypeUtil.isSimple(type)) {
          const packValue = this.valueConverter.pack(current.rootNames, propName, childValue);
          this.packSimple(current, packName, type, packValue);
        }
      }
    }
  }

  private packArray(references: PackedRef[], parent: PackedRef | undefined, propertyName: string | undefined, value: unknown, pos: PackedRefPosition) {
    const position = this.objectPosition.level(pos);

    const current: PackedRef = new PackedRef("array", position, parent, propertyName);
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
          this.packObject(references, current, undefined, item, p);
        } else if (type === "array") {
          current.children.push({
            type,
            splitter: s.ArrayProperty,
            value: "",
          });
          this.packArray(references, current, undefined, item, p);
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
          this.packSimple(current, undefined, type, item);
        }
      }
    }
  }

  public pack(source: unknown): string {
    let references: PackedRef[] = [];
    const lines: string[] = [];

    const type = TypeUtil.getType(source);

    if (type) {
      const p = this.objectPosition.reset();
      if (type === "object") {
        this.packObject(references, undefined, undefined, source, p);
      } else if (type === "array") {
        this.packArray(references, undefined, undefined, source, p);
      } else if (TypeUtil.isSimple(type) || TypeUtil.isEmpty(type)) {
        const current: PackedRef = new PackedRef(type, p);
        references.push(current);
        if (TypeUtil.isSimple(type)) {
          this.packSimple(current, undefined, type, source);
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
          .map(({ packedName, splitter, value }) => {
            return (packedName ? packedName : "") + splitter + value;
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

    let fullResult = lines.join(s.Object);

    if (!this.ignoreMaxLength && fullResult?.length + this.domainOriginLength > this.maxLength) {
      throw new QpError(QpErrorCode.MAX_LENGTH, `The max length of URL is ${this.maxLength}. You have - ${fullResult.length + this.domainOriginLength}`);
    }

    if (this.useOptimizer) {
      fullResult = this.arrayOptimizer.pack(fullResult);
    }

    return fullResult;
  }

  public unpack(packed: string): any {
    const input = this.useOptimizer ? this.arrayOptimizer.unpack(packed) : packed;
    const [version, restPacked] = this.parser.version(input);
    if ([ComplexHandler.Version].includes(version || 0)) {
      let result: object | undefined = undefined;
      // multi objects
      if (restPacked.match(this.parser.objectReg)) {
        const parsedObjects = this.parser.objects(restPacked);
        if (parsedObjects.length > 0) {
          const root = parsedObjects[0];
          if (TypeUtil.isComplexOrEmpty(root.type)) {
            const realObjects: any[] = [];
            const links: [PackType, number, string | number, number][] = [];
            let lastRefIndex = -1;
            for (let i = 0; i < parsedObjects.length; i++) {
              const { type, properties } = parsedObjects[i];
              // ARRAY
              if (type === "array") {
                const array: any[] = [];
                for (let propIndex = 0; propIndex < properties.length; propIndex++) {
                  const { splitter, value, type } = properties[propIndex];
                  const itemValue = this.simple.unpack(splitter, value);
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
                  obj[name] = this.simple.unpack(splitter, value);
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
      else if (restPacked.match(this.parser.propertyAllReg)) {
        const props = this.parser.properties(restPacked);
        const obj = {};
        for (const { name, splitter, value } of props) {
          const key = this.simple.unpack<string>(s.StringProperty, name);
          obj[key] = this.simple.unpack(splitter, value);
        }
        result = obj;
      }
      // simple value or array
      else if (restPacked.match(this.parser.itemAllReg)) {
        const ps = this.parser.items(restPacked);
        const values = ps.map(({ splitter, value }) => {
          return this.simple.unpack(splitter, value);
        });
        if (values.length) {
          result = (values.length === 1 ? values[0] : values) as object;
        }
      }
      // empty object
      else if (restPacked === "") {
        result = {};
      }

      if (result) {
        result = this.fieldConverter.unpack(result);
        result = this.valueConverter.unpack(result);
      }

      return result;
    } else {
      throw Error(`${version} is not supported`);
    }
  }
}
