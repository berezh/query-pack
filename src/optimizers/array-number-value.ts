import { ARRAY_ITEM_OPTIMIZER_MIN_MATCH, ARRAY_VALUE_OPTIMIZER_MIN_REPEAT } from "../lib/consts";
import { Number32 } from "../lib/number32";
import { UsedSigns } from "../lib/used-signs";
import { BasicValueOptimizer } from "./basic-value";

const Splitter = UsedSigns.Splitter.NumberProperty;

export class ArrayNumberValueOptimizer extends BasicValueOptimizer {
  constructor() {
    const possibleValues = Number32.Sings;
    super(
      Splitter,
      new RegExp(`(${Splitter}[${possibleValues}]+){${ARRAY_ITEM_OPTIMIZER_MIN_MATCH},}`, "g"),
      new RegExp(`${Splitter}{${ARRAY_VALUE_OPTIMIZER_MIN_REPEAT},}[${possibleValues}]+`, "g")
    );
  }
}
