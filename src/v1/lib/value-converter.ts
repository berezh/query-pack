import { ZipValueConvertor } from "../interfaces";

export class ValueConverter {
  private convertor: ZipValueConvertor;

  constructor(convertor: ZipValueConvertor) {
    this.convertor = convertor;
    this.validateConvertor([], this.convertor);
  }

  private validateConvertor(names: string[], c: ZipValueConvertor) {
    const keyValues: [string, number | string][] = [];
    for (const key in c) {
      let value = c[key];
      if (typeof value === "object") {
        this.validateConvertor([...names, key], value);
        value = value[0];
      } else {
        keyValues.push([key, value]);
      }

      const duplication = keyValues.filter(x => x[1] === value);
      if (duplication.length > 1) {
        const message = `Value converter fields: ${duplication.map(x => `${names.join(".")}.${x[0]}`).join(", ")} have same value ${duplication[0][1]}.`;
        throw new Error(message);
      }
    }
  }

  private find(roots: string[]): ZipValueConvertor | undefined {
    let r: ZipValueConvertor | undefined = this.convertor;
    for (const root of roots) {
      if (r) {
        const v = r[root];
        if (typeof v === "object") {
          r = v;
        }
      } else {
        r = undefined;
        break;
      }
    }
    return r;
  }

  public zip(roots: string[], name: string, value: string): string {
    const c = this.find([...roots, name]);
    if (c) {
      const alt = c[value];
      if (typeof alt === "string" || typeof alt === "number") {
        return `${alt}`;
      }
    }
    return value;
  }

  public unzipValue(roots: string[], name: string, value: string | number): string | number {
    const c = this.find([...roots, name]);
    if (c) {
      const originalValue = Object.keys(c).find(key => `${c[key]}` === `${value}`);
      if (typeof originalValue === "string" || typeof originalValue === "number") {
        return originalValue;
      }
    }
    return value;
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
        const zippedValue = objectValue[key];
        if (zippedValue !== null) {
          if (typeof zippedValue === "string") {
            objectValue[key] = this.unzipValue(names, key, zippedValue);
          } else if (typeof zippedValue === "object") {
            this.init([...names, key], zippedValue);
          }
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
