import { ARRAY_ITEM_OPTIMIZER_MIN_MATCH, BOOL_FALSE, BOOL_TRUE } from "../lib/consts";
import { UsedSigns } from "../lib/used-signs";
import { BasicOptimizer } from "./basic";

const s = UsedSigns.Splitter;

const Repeat = 2;

export class ArrayBoolValueOptimizer extends BasicOptimizer {
  private readonly packReg: RegExp;

  private readonly unpackReg: RegExp;

  constructor() {
    super();
    const possibleValues = `${BOOL_TRUE}${BOOL_FALSE}`;
    this.packReg = new RegExp(`(${s.BooleanProperty}[${possibleValues}]){${ARRAY_ITEM_OPTIMIZER_MIN_MATCH},}`, "g");
    this.unpackReg = new RegExp(`${s.BooleanProperty.repeat(Repeat)}[${possibleValues}]+`, "g");
  }

  public pack(input: string): string {
    if (input.match(this.packReg)) {
      return input.replace(this.packReg, match => {
        return s.BooleanProperty.repeat(Repeat) + match.replace(new RegExp(`${s.BooleanProperty}`, "g"), "");
      });
    }

    return input;
  }

  public unpack(input: string): string {
    if (input.match(this.unpackReg)) {
      return input.replace(this.unpackReg, match => {
        const values = match.slice(Repeat);
        let result = "";

        for (const char of values) {
          result += s.BooleanProperty + char;
        }

        return result;
      });
    }

    return input;
  }
}
