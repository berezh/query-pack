import { SimpleHandler } from "../handlers/simple-handler";
import { PackFieldConvertor } from "../interfaces";
import { Number32 } from "../lib/number32";
import { UsedSigns } from "../lib/used-signs";

const s = UsedSigns.Splitter;

export class FieldConverter {
  private convertor: PackFieldConvertor;

  private simpleHandler = new SimpleHandler();

  constructor(convertor: PackFieldConvertor) {
    this.convertor = convertor;
    this.validateConvertor([], convertor);
  }

  private validateConvertor(names: string[], c: PackFieldConvertor) {
    const keyValues: [string, number][] = [];
    for (const key in c) {
      let value = c[key];
      if (Array.isArray(value)) {
        this.validateConvertor([...names, key], value[1]);
        value = value[0];
      }
      keyValues.push([key, value]);

      const duplication = keyValues.filter(x => x[1] === value);
      if (duplication.length > 1) {
        const message = `Field converter fields: ${duplication.map(x => `${names.join(".")}.${x[0]}`).join(", ")} have same value ${duplication[0][1]}.`;
        throw new Error(message);
      }
    }
  }

  private getPropertyNumber(...names: string[]): number | undefined {
    let con: PackFieldConvertor | undefined = this.convertor;
    let propNumber: number | undefined = undefined;
    for (const name of names) {
      const child = con ? con[name] : undefined;
      if (Array.isArray(child)) {
        propNumber = child[0];
        con = child[1];
      } else if (typeof child === "number") {
        propNumber = child;
        con = undefined;
      } else {
        propNumber = undefined;
        con = undefined;
        break;
      }
    }

    return propNumber;
  }

  public pack(names: string[] | undefined, currentName: string): string {
    if (this.convertor) {
      const path: string[] = [];
      if (Array.isArray(names)) {
        path.push(...names);
      }
      path.push(currentName);
      const conValue = this.getPropertyNumber(...path);
      if (typeof conValue === "number") {
        return this.simpleHandler.pack("number", conValue)?.value || "";
      }
    }

    return this.simpleHandler.pack("string", currentName)?.value || "";
  }

  private getPropertyName(names: string[], propNumber: number): string | undefined {
    let con: PackFieldConvertor | undefined = this.convertor;
    for (const name of names) {
      const child = con ? con[name] : undefined;
      if (Array.isArray(child)) {
        con = child[1];
      } else {
        con = undefined;
        break;
      }
    }

    if (typeof con === "object") {
      return Object.keys(con).find(key => {
        const conValue = (con || {})[key];
        if (Array.isArray(conValue)) {
          if (conValue[0] === propNumber) {
            return true;
          }
        } else if (typeof conValue === "number") {
          if (conValue === propNumber) {
            return true;
          }
        }
        return false;
      });
    }

    return undefined;
  }

  private unpackName(names: string[], packedName: string): string {
    if (Number32.isBase32(packedName)) {
      const propNumber = Number32.toNumber(packedName);
      const propName = this.getPropertyName(names, propNumber);
      if (typeof propName === "string") {
        return propName;
      }
    }

    return this.simpleHandler.unpack(s.StringProperty, packedName);
  }

  private init(names: string[], value: unknown) {
    if (Array.isArray(value)) {
      for (const valueItem of value) {
        this.init(names, valueItem);
      }
    } else if (value !== null && typeof value === "object") {
      const objectValue = value as object;
      const keys = Object.keys(objectValue);
      for (const key of keys) {
        const propName = this.unpackName(names, key);
        if (propName !== key) {
          const value = objectValue[key];
          delete objectValue[key];
          objectValue[propName] = value;
        }

        const propValue = objectValue[propName];
        if (propValue !== null && typeof propValue === "object") {
          this.init([...names, propName], propValue);
        }
      }
    }
  }

  public unpack(root: object): object {
    if (this.convertor) {
      const names: string[] = [];
      this.init(names, root);
    }

    return root;
  }
}
