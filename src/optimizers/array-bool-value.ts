import { ARRAY_ITEM_OPTIMIZER_MIN_MATCH, BOOL_FALSE, BOOL_TRUE } from "../lib/consts";
import { UsedSigns } from "../lib/used-signs";
import { BasicValueOptimizer } from "./basic-value";

const Splitter = UsedSigns.Splitter.BooleanProperty;

const Repeat = 2;

export class ArrayBoolValueOptimizer extends BasicValueOptimizer {
  constructor() {
    const possibleValues = `${BOOL_TRUE}${BOOL_FALSE}`;
    super(Splitter, new RegExp(`(${Splitter}[${possibleValues}]){${ARRAY_ITEM_OPTIMIZER_MIN_MATCH},}`, "g"), new RegExp(`${Splitter.repeat(Repeat)}[${possibleValues}]+`, "g"));
  }
}
