import { HandledType, SimpleResult } from "../interfaces";
import { BooleanZipper } from "../zippers/boolean";
import { NumberZipper } from "../zippers/number";
import { StringZipper } from "../zippers/string";
import { UpperCaseZipper } from "../zippers/upper-case";
import { Zipper } from "../zippers/zipper";
import { UsedSigns } from "./used-signs";

interface TypeOperator {
  type: HandledType;
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
      splitter: UsedSigns.Splitter.StringProperty,
      zippers: [this.upperCaseZipper, this.stringZipper],
      unzippers: [this.stringZipper, this.upperCaseZipper],
    },
    {
      type: "number",
      splitter: UsedSigns.Splitter.NumberProperty,
      zippers: [new NumberZipper()],
    },
    {
      type: "boolean",
      splitter: UsedSigns.Splitter.BooleanProperty,
      zippers: [new BooleanZipper()],
    },
  ];

  public zip(type: HandledType, source: unknown): SimpleResult | undefined {
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
