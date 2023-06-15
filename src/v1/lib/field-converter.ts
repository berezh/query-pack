import { ZipFieldConvertor } from "../interfaces";
import { Number32 } from "./number32";
import { SimpleHandler } from "./simple-handler";
import { UsedSigns } from "./used-signs";

const s = UsedSigns.Splitter;

export class FieldConverter {
  private convertor: ZipFieldConvertor;

  private simpleHandler = new SimpleHandler();

  constructor(convertor: ZipFieldConvertor) {
    this.convertor = convertor;
    this.validateConvertor([], convertor);
  }

  private validateConvertor(names: string[], c: ZipFieldConvertor) {
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
    let con: ZipFieldConvertor | undefined = this.convertor;
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

  public zip(names: string[] | undefined, currentName: string): string {
    if (this.convertor) {
      const path: string[] = [];
      if (Array.isArray(names)) {
        path.push(...names);
      }
      path.push(currentName);
      const conValue = this.getPropertyNumber(...path);
      if (typeof conValue === "number") {
        return this.simpleHandler.zip("number", conValue)?.value || "";
      }
    }

    return this.simpleHandler.zip("string", currentName)?.value || "";
  }

  private getPropertyName(names: string[], propNumber: number): string | undefined {
    let con: ZipFieldConvertor | undefined = this.convertor;
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

  private unzipName(names: string[], zippedName: string): string {
    if (Number32.isBase32(zippedName)) {
      const propNumber = Number32.toNumber(zippedName);
      const propName = this.getPropertyName(names, propNumber);
      if (typeof propName === "string") {
        return propName;
      }
    }

    return this.simpleHandler.unzip(s.StringProperty, zippedName);
  }

  private init(names: string[], value: unknown) {
    if (Array.isArray(value)) {
      for (const valueItem of value) {
        this.init(names, valueItem);
      }
    } else if (typeof value === "object") {
      const objectValue = value as object;
      const keys = Object.keys(objectValue);
      for (const key of keys) {
        const propName = this.unzipName(names, key);
        if (propName !== key) {
          const value = objectValue[key];
          delete objectValue[key];
          objectValue[propName] = value;
        }

        const currentValue = objectValue[propName];
        if (typeof currentValue === "object") {
          this.init([...names, propName], currentValue);
        }
      }
    }
  }

  public unzip(root: object): object {
    if (this.convertor) {
      const names: string[] = [];
      this.init(names, root);
    }

    return root;
  }
}
