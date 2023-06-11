// ABCDEFGHIJKLMNOPQRSTUVWXYZ
import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

export class UpperCaseZipper extends Zipper<string> {
  private zipAnyMatch: RegExp;

  private unzipAnyMatch: RegExp;

  constructor() {
    super();

    this.zipAnyMatch = /[A-Z]+/g;
    this.unzipAnyMatch = new RegExp(`${UsedSigns.UpperCase}[a-z]{1}([a-z]{1,}${UsedSigns.UpperCase})?`, "g");
  }

  public zip(source: string): string {
    let result = source;
    if (typeof result === "string" && result.match(this.zipAnyMatch)) {
      result = result.replace(this.zipAnyMatch, match => {
        if (match.length === 1) {
          return UsedSigns.UpperCase + match.toLowerCase();
        } else if (match.length > 1) {
          return UsedSigns.UpperCase + match.toLowerCase() + UsedSigns.UpperCase;
        }

        return "";
      });
    }

    return result;
  }

  public unzip(zipped: string): string {
    let result = zipped;
    if (typeof result === "string" && result.match(this.unzipAnyMatch)) {
      result = result.replace(this.unzipAnyMatch, match => {
        return match.replace(new RegExp(UsedSigns.UpperCase, "g"), "").toUpperCase();
      });
    }
    return result;
  }
}
