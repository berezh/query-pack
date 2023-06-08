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

interface SignReplace {
  regex: RegExp;
  replace: string;
}

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

  private zipMatches: SignReplace[] = [];

  private unzipAnyMatch: RegExp;

  private unzipMatches: SignReplace[] = [];

  constructor() {
    super();
    let zipReg = "";
    for (const key in this.signs) {
      const { altRegex, special, alt } = this.signs[key];
      if (altRegex) {
        zipReg += altRegex;
        this.zipMatches.push({ regex: new RegExp(altRegex, "g"), replace: alt });
      } else {
        const caseReg = (special === true ? "\\" : "") + key;
        zipReg += caseReg;
        this.zipMatches.push({ regex: new RegExp(caseReg, "g"), replace: alt });
      }
    }
    this.zipAnyMatch = new RegExp(`[${zipReg}]`);

    let unzipReg = "";
    const keys = Object.keys(this.signs);
    for (const key of keys) {
      const { alt } = this.signs[key];
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
