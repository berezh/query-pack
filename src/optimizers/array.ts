import { UsedSigns } from "../lib/used-signs";
import { ArrayBoolValueOptimizer } from "./array-bool-value";
import { ArrayItemSplitterOptimizer } from "./array-item-splitter";
import { ArrayNumberValueOptimizer } from "./array-number-value";
import { BasicOptimizer } from "./basic";
import { BasicValueOptimizer } from "./basic-value";

const s = UsedSigns.Splitter;

export class ArrayOptimizer extends BasicOptimizer {
  private itemOptimizers: ArrayItemSplitterOptimizer[] = [];

  private valueOptimizers: BasicValueOptimizer[] = [];

  constructor() {
    super();
    const splitters = [s.ObjectProperty, s.ArrayProperty, s.NullProperty, s.UndefinedProperty];
    for (const splitter of splitters) {
      this.itemOptimizers.push(new ArrayItemSplitterOptimizer(splitter));
    }
    this.valueOptimizers.push(new ArrayBoolValueOptimizer());
    this.valueOptimizers.push(new ArrayNumberValueOptimizer());
  }

  public pack(input: string): string {
    let result = input;

    for (const optimizer of this.itemOptimizers) {
      result = optimizer.pack(result);
    }

    for (const optimizer of this.valueOptimizers) {
      result = optimizer.pack(result);
    }

    return result;
  }

  public unpack(input: string): string {
    let result = input;

    for (const optimizer of this.itemOptimizers) {
      result = optimizer.unpack(result);
    }

    for (const optimizer of this.valueOptimizers) {
      result = optimizer.unpack(result);
    }

    return result;
  }
}
