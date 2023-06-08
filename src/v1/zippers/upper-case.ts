// abcdefghijklmnopqrstuvwxyz
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
// 0123456789
// -_.~

import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

// !*'();:@&=+$,/?#[]
export class UpperCaseZipper extends Zipper<string> {
  public zip(source: string): string {
    let result = "";
    if (typeof source === "string") {
      for (const ch of source) {
        const replace = UpperCaseZipper.sign[ch];
        result += typeof replace === "string" ? `${UsedSigns.UpperCase}${replace}` : ch;
      }
    }
    return result;
  }

  public unzip(zipped: string): string {
    throw new Error("Method not implemented.");
  }

  public static sign: Record<string, string> = {
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
    U: "u",
    V: "v",
    W: "w",
    X: "x",
    Y: "y",
    Z: "z",
  };
}
