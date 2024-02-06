// ABCDEFGHIJKLMNOPQRSTUVWXYZ
import { UsedSigns } from "../lib/used-signs";
import { BasicPacker } from "./basic";

export class UpperCasePacker extends BasicPacker<string> {
  private packAnyMatch: RegExp;

  private unpackAnyMatch: RegExp;

  constructor() {
    super();

    this.packAnyMatch = /[A-Z]+/g;
    this.unpackAnyMatch = new RegExp(`(${UsedSigns.UpperCase}[a-z])|(${UsedSigns.UpperCase}\\d+[a-z]+)`, "g");
  }

  public pack(source: string): string {
    let result = source;
    if (typeof result === "string" && result.match(this.packAnyMatch)) {
      result = result.replace(this.packAnyMatch, match => {
        if (match.length === 1) {
          return UsedSigns.UpperCase + match.toLowerCase();
        } else if (match.length > 1) {
          return UsedSigns.UpperCase + match.length + match.toLowerCase();
        }

        return "";
      });
    }

    return result;
  }

  public unpack(packed: string): string {
    let result = packed;
    if (typeof result === "string" && result.match(this.unpackAnyMatch)) {
      result = result.replace(this.unpackAnyMatch, match => {
        return match.replace(new RegExp(`${UsedSigns.UpperCase}\\d*`, "g"), "").toUpperCase();
      });
    }
    return result;
  }
}
