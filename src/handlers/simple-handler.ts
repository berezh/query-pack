import { BooleanZipper } from "../zippers/boolean";
import { NullZipper } from "../zippers/null";
import { NumberZipper } from "../zippers/number";
import { StringZipper } from "../zippers/string";
import { UndefinedZipper } from "../zippers/undefined";
import { UpperCaseZipper } from "../zippers/upper-case";
import { Zipper } from "../zippers/zipper";
import { UsedSigns } from "../lib/used-signs";
import { PackType, PackedValue } from "../interfaces";

const s = UsedSigns.Splitter;

interface TypeOperator {
  type: PackType;
  splitter: string;
  zippers: Zipper[];
  unzippers?: Zipper[];
}

export class SimpleHandler {
  private upperCaseZipper = new UpperCaseZipper();

  private stringZipper = new StringZipper();

  private operators: TypeOperator[] = [
    {
      type: "string",
      splitter: s.StringProperty,
      zippers: [this.upperCaseZipper, this.stringZipper],
      unzippers: [this.stringZipper, this.upperCaseZipper],
    },
    {
      type: "number",
      splitter: s.NumberProperty,
      zippers: [new NumberZipper()],
    },
    {
      type: "boolean",
      splitter: s.BooleanProperty,
      zippers: [new BooleanZipper()],
    },
    {
      type: "null",
      splitter: s.NullProperty,
      zippers: [new NullZipper()],
    },
    {
      type: "undefined",
      splitter: s.UndefinedProperty,
      zippers: [new UndefinedZipper()],
    },
  ];

  public zip(type: PackType, source: unknown): PackedValue | undefined {
    const operator = this.operators.find(x => x.type === type);
    if (operator) {
      let result = source;
      const { zippers } = operator;
      for (const zipper of zippers) {
        result = zipper.zip(result);
      }
      return {
        type: operator.type,
        splitter: operator?.splitter || "",
        value: result as string,
      };
    }

    return undefined;
  }

  public unzip<T = unknown>(splitter: string, zipped: string): T {
    const operator = this.operators.find(x => x.splitter === splitter);
    let result: any = zipped;
    if (operator) {
      const { unzippers, zippers } = operator;
      for (const zipper of unzippers || zippers) {
        result = zipper.unzip(result);
      }
    }
    return result;
  }
}
