// abcdefghijklmnopqrstuvwxyz
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
// 0123456789
// -_.~

import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

// !*'();:@&=+$,/?#[]

interface SignInfo {
  alt: string;
  altRegex?: string;
  special?: boolean;
}

export type IItemType = typeof UsedSigns.String.WhiteSpace | typeof UsedSigns.String.Apostrophe;

// https://www.threesl.com/blog/special-characters-regular-expressions-escape/
// regex special: ., +, *, ?, ^, $, (, ), [, ], {, }, |, \.

export class StringZipper extends Zipper<string> {
  private readonly signs: Record<string, SignInfo> = {
    " ": { alt: UsedSigns.String.WhiteSpace, altRegex: "\\s" },
    "'": { alt: UsedSigns.String.Apostrophe },
    "(": { alt: UsedSigns.String.LeftParenthesis, special: true },
    ")": { alt: UsedSigns.String.RightParenthesis, special: true },
    ";": { alt: UsedSigns.String.Semicolon },
    ":": { alt: UsedSigns.String.Colon },
    "@": { alt: UsedSigns.String.At },
    "=": { alt: UsedSigns.String.Equals },
    "+": { alt: UsedSigns.String.Plus, special: true },
    ",": { alt: UsedSigns.String.Comma },
    "?": { alt: UsedSigns.String.QuestionMark, special: true },
    '"': { alt: UsedSigns.String.Quotation },
  };

  private zipAnyMatch: RegExp;

  private unzipAnyMatch: RegExp;

  constructor() {
    super();
    let zipReg = "";
    for (const key in this.signs) {
      const { altRegex, special } = this.signs[key];
      zipReg += altRegex ? altRegex : (special === true ? "\\" : "") + key;
    }
    this.zipAnyMatch = new RegExp(`[${zipReg}]`, "g");

    let unzipReg = "";
    const keys = Object.keys(this.signs);
    for (const key of keys) {
      unzipReg += this.signs[key].alt;
    }
    this.unzipAnyMatch = new RegExp(`[${unzipReg}]`, "g");
  }

  public zip(source: string): string {
    let result = source;
    if (typeof result === "string" && result.match(this.zipAnyMatch)) {
      result = result.replace(this.zipAnyMatch, match => {
        const info = this.signs[match];
        return info?.alt;
      });
    }

    return result;
  }

  public unzip(zipped: string): string {
    let result = zipped;
    if (typeof result === "string" && result.match(this.unzipAnyMatch)) {
      result = result.replace(this.unzipAnyMatch, match => {
        const key = Object.keys(this.signs).find(key => this.signs[key].alt === match);
        return key || "";
      });
    }
    return result;
  }
}
