// abcdefghijklmnopqrstuvwxyz
// ABCDEFGHIJKLMNOPQRSTUVWXYZ
// 0123456789
// -_.~

import { UsedSigns } from "../lib/used-signs";
import { BasicPacker } from "./basic";

const s = UsedSigns.String;

interface SignInfo {
  alt: string;
  altRegex?: string;
  special?: boolean;
}

export type IItemType = typeof s.WhiteSpace | typeof s.Apostrophe;

export class StringPacker extends BasicPacker<string> {
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

  private packAnyMatch: RegExp;

  private unpackAnyMatch: RegExp;

  constructor() {
    super();
    let packReg = "";
    for (const key in this.signs) {
      const { altRegex, special } = this.signs[key];
      packReg += altRegex ? altRegex : (special === true ? "\\" : "") + key;
    }
    this.packAnyMatch = new RegExp(`[${packReg}]`, "g");

    let unpackReg = "";
    const keys = Object.keys(this.signs);
    for (const key of keys) {
      unpackReg += this.signs[key].alt;
    }
    this.unpackAnyMatch = new RegExp(`[${unpackReg}]`, "g");
  }

  public pack(source: string): string {
    let result = source;
    if (typeof result === "string") {
      if (result.match(this.packAnyMatch)) {
        result = result.replace(this.packAnyMatch, match => {
          const info = this.signs[match];
          return info?.alt;
        });
      }
      if (result === "") {
        result = UsedSigns.EmptyString;
      }
    }

    return result;
  }

  public unpack(packed: string): string {
    let result = packed;
    if (typeof result === "string") {
      if (result.match(this.unpackAnyMatch)) {
        result = result.replace(this.unpackAnyMatch, match => {
          const key = Object.keys(this.signs).find(key => this.signs[key].alt === match);
          return key || "";
        });
      }
      if (result === UsedSigns.EmptyString) {
        result = "";
      }
    }
    return result;
  }
}
