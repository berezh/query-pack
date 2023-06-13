import { ZipConvertor } from "../interfaces";
import { Number32 } from "./number32";
import { SimpleHandler } from "./simple-handler";
import { UsedSigns } from "./used-signs";

const s = UsedSigns.Splitter;
export class NameConverter {
  private convertor: ZipConvertor;

  private simpleHandler = new SimpleHandler();

  constructor(convertor: ZipConvertor) {
    this.convertor = convertor;
  }

  private getConverter(...names: string[]): ZipConvertor | undefined {
    let con: ZipConvertor | undefined = this.convertor;
    for (const name of names) {
      if (typeof con === "object") {
        con = con[name] as ZipConvertor;
      } else {
        con = undefined;
        break;
      }
    }

    return con;
  }

  public zipName(names: string[], currentName: string): string {
    const con = this.getConverter(...names);
    if (con) {
      const conValue = con[currentName];
      if (typeof conValue === "number") {
        return this.simpleHandler.zip("number", conValue)?.value || "";
      }
    }

    return this.simpleHandler.zip("string", currentName)?.value || "";
  }

  public unzipName(names: string[], currentName: string): string {
    if (Number32.isBase32(currentName)) {
      const con = this.getConverter(...names);
      if (con) {
        const propNum = Number32.toNumber(currentName);
        const keyName = Object.keys(con).find(key => con[key] === propNum);
        if (typeof keyName === "string") {
          return keyName;
        }
      }
    }

    return this.simpleHandler.unzip(s.StringProperty, currentName);
  }
}
