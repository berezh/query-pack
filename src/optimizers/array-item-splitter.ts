import { ARRAY_ITEM_OPTIMIZER_MIN_MATCH } from "../lib/consts";
import { Number32 } from "../lib/number32";
import { UsedSigns } from "../lib/used-signs";
import { BasicOptimizer } from "./basic";

const s = UsedSigns.Splitter;

export class ArrayItemSplitterOptimizer extends BasicOptimizer {
  private readonly splitter: string;

  private readonly packReg: RegExp;

  private readonly unpackReg: RegExp;

  constructor(splitter: string) {
    super();
    this.splitter = splitter;
    this.packReg = new RegExp(`${splitter}{${ARRAY_ITEM_OPTIMIZER_MIN_MATCH},}`, "g");
    this.unpackReg = new RegExp(`${splitter}[${Number32.Sings}]+`, "g");
  }

  public pack(input: string): string {
    if (input.match(this.packReg)) {
      return input.replace(this.packReg, match => {
        return this.splitter + Number32.toBase32(match.length - 1);
      });
    }

    return input;
  }

  public unpack(input: string): string {
    if (input.match(this.unpackReg)) {
      return input.replace(this.unpackReg, match => {
        return s.ObjectProperty.repeat(1 + Number32.toNumber(match.slice(s.ObjectProperty.length)));
      });
    }

    return input;
  }
}
