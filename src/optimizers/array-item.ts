import { UsedSigns } from "../lib/used-signs";
import { ArrayItemSplitterOptimizer } from "./array-item-splitter";
import { BasicOptimizer } from "./basic";

const s = UsedSigns.Splitter;

export class ArrayItemOptimizer extends BasicOptimizer {
  private matches: ArrayItemSplitterOptimizer[] = [];

  constructor() {
    super();
    const splitters = [s.ObjectProperty, s.ArrayProperty, s.NullProperty, s.UndefinedProperty];
    for (const splitter of splitters) {
      this.matches.push(new ArrayItemSplitterOptimizer(splitter));
    }
  }

  public pack(input: string): string {
    let result = input;

    for (const match of this.matches) {
      result = match.pack(result);
    }

    return result;
  }

  public unpack(input: string): string {
    let result = input;

    for (const match of this.matches) {
      result = match.unpack(result);
    }

    return result;
  }
}
