// abcdefghijklmnopqrstuvwxyz
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
// 0123456789
// -_.~

import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

const s = UsedSigns.String;

interface SignInfo {
  alt: string;
  altRegex?: string;
  special?: boolean;
}

export type IItemType = typeof s.WhiteSpace | typeof s.Apostrophe;
export class StringZipper extends Zipper<string> {
  private readonly signs: Record<string, SignInfo> = {
    " ": { alt: s.WhiteSpace, altRegex: "\\s" },
    "'": { alt: s.Apostrophe },
    "(": { alt: s.LeftParenthesis, special: true },
    ")": { alt: s.RightParenthesis, special: true },
    ";": { alt: s.Semicolon },
    ":": { alt: s.Colon },
    "@": { alt: s.At },
    "=": { alt: s.Equals },
    "+": { alt: s.Plus, special: true },
    ",": { alt: s.Comma },
    "?": { alt: s.QuestionMark, special: true },
    '"': { alt: s.Quotation },
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
    if (typeof result === "string") {
      if (result.match(this.zipAnyMatch)) {
        result = result.replace(this.zipAnyMatch, match => {
          const info = this.signs[match];
          return info?.alt;
        });
      }
      if (result === "") {
        result = s.Empty;
      }
    }

    return result;
  }

  public unzip(zipped: string): string {
    let result = zipped;
    if (typeof result === "string") {
      if (result.match(this.unzipAnyMatch)) {
        result = result.replace(this.unzipAnyMatch, match => {
          const key = Object.keys(this.signs).find(key => this.signs[key].alt === match);
          return key || "";
        });
      }
      if (result === s.Empty) {
        result = "";
      }
    }
    return result;
  }
}
