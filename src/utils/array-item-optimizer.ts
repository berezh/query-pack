import { ARRAY_ITEM_OPTIMIZER_MIN_MATCH } from "../lib/consts";
import { Number32 } from "../lib/number32";
import { UsedSigns } from "../lib/used-signs";

const s = UsedSigns.Splitter;

class ArrayItemMatch {
  private readonly splitter: string;

  private readonly optimizeReg: RegExp;

  private readonly unoptimizeReg: RegExp;

  constructor(splitter: string) {
    this.splitter = splitter;
    this.optimizeReg = new RegExp(`${splitter}{${ARRAY_ITEM_OPTIMIZER_MIN_MATCH},}`, "g");
    this.unoptimizeReg = new RegExp(`${splitter}[${Number32.Sings}]+`, "g");
  }

  public optimize(input: string): string {
    if (input.match(this.optimizeReg)) {
      return input.replace(this.optimizeReg, match => {
        return this.splitter + Number32.toBase32(match.length - 1);
      });
    }

    return input;
  }

  public unoptimize(input: string): string {
    if (input.match(this.unoptimizeReg)) {
      return input.replace(this.unoptimizeReg, match => {
        return s.ObjectProperty.repeat(1 + Number32.toNumber(match.slice(s.ObjectProperty.length)));
      });
    }

    return input;
  }
}

export class ArrayItemOptimizer {
  private matches: ArrayItemMatch[] = [];

  constructor() {
    const splitters = [s.ObjectProperty, s.ArrayProperty, s.NullProperty, s.UndefinedProperty];
    for (const splitter of splitters) {
      this.matches.push(new ArrayItemMatch(splitter));
    }
  }

  public optimize(packed: string): string {
    let result = packed;

    for (const match of this.matches) {
      result = match.optimize(result);
    }

    return result;
  }

  public unoptimize(packed: string): string {
    let result = packed;

    for (const match of this.matches) {
      result = match.unoptimize(result);
    }

    return result;
  }
}
