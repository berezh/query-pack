// abcdefghijklmnopqrstuvwxyz
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
// 0123456789
// -_.~

import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

// !*'();:@&=+$,/?#[]
export class StringZipper extends Zipper<string> {
  public zip(source: string): string {
    let result = "";
    if (typeof source === "string") {
      for (const ch of source) {
        const replace = StringZipper.signs[ch];
        result += typeof replace === "string" ? replace : ch;
      }
    }
    return result;
  }

  public unzip(zipped: string): string {
    throw new Error("Method not implemented.");
  }

  public static signs: Record<string, string> = {
    " ": UsedSigns.String.WhiteSpace,
    // "!": TextParser.ExclanationMark,
    // "*": "",
    "'": UsedSigns.String.Apostrophe,
    "(": UsedSigns.String.LeftParenthesis,
    ")": UsedSigns.String.RightParenthesis,
    ";": UsedSigns.String.Semicolon,
    ":": UsedSigns.String.Colon,
    "@": UsedSigns.String.At,
    "&": "M",
    "=": UsedSigns.String.Equals,
    "+": UsedSigns.String.Plus,
    // $: "",
    ",": UsedSigns.String.Comma,
    // "/": "",
    "?": UsedSigns.String.QuestionMark,
    // "#": "",
    // "[": "",
    // "]": "",
  };
}
