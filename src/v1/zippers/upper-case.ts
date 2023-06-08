// ABCDEFGHIJKLMNOPQRSTUVWXYZ

import { SignReplace } from "../interfaces";
import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

export class UpperCaseZipper extends Zipper<string> {
  private signs: Record<string, string> = {
    // at the end:
    U: "u",
    A: "a",
    B: "b",
    C: "c",
    D: "d",
    E: "e",
    F: "f",
    G: "g",
    H: "h",
    I: "i",
    J: "j",
    K: "k",
    L: "l",
    M: "m",
    N: "n",
    O: "o",
    P: "p",
    Q: "q",
    R: "r",
    S: "s",
    T: "t",
    V: "v",
    W: "w",
    X: "x",
    Y: "y",
    Z: "z",
  };

  private zipAnyMatch: RegExp;

  private zipMatches: SignReplace[] = [];

  private unzipAnyMatch: RegExp;

  private unzipMatches: SignReplace[] = [];

  constructor() {
    super();
    let zipReg = "";
    for (const key in this.signs) {
      zipReg += key;
      this.zipMatches.push({ regex: new RegExp(key, "g"), replace: `${UsedSigns.UpperCase}${this.signs[key]}` });
    }
    this.zipAnyMatch = new RegExp(`[${zipReg}]`);

    let unzipReg = "";
    const keys = Object.keys(this.signs);
    for (const key of keys) {
      const alt = `${UsedSigns.UpperCase}${this.signs[key]}`;
      unzipReg += alt;
      this.unzipMatches.push({ regex: new RegExp(alt, "g"), replace: key });
    }
    this.unzipAnyMatch = new RegExp(`[${unzipReg}]`);
  }

  public zip(source: string): string {
    let result = source;
    if (typeof result === "string" && this.zipAnyMatch.test(result)) {
      for (const { regex, replace } of this.zipMatches) {
        result = result.replace(regex, replace);
      }
    }

    return result;
  }

  public unzip(zipped: string): string {
    let result = zipped;
    if (typeof result === "string" && this.unzipAnyMatch.test(result)) {
      for (const { regex, replace } of this.unzipMatches) {
        result = result.replace(regex, replace);
      }
    }
    return result;
  }
}
