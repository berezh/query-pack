import { HandledType, SimpleResult } from "../interfaces";
import { BoolZipper } from "../zippers/bool";
import { NumberZipper } from "../zippers/number";
import { StringZipper } from "../zippers/string";
import { UpperCaseZipper } from "../zippers/upper-case";
import { Zipper } from "../zippers/zipper";
import { UsedSigns } from "./used-signs";

interface TypeOperator {
  type: HandledType;
  splitter: string;
  zippers: Zipper[];
}

export class SimpleHandler {
  private operators: TypeOperator[] = [
    {
      type: "string",
      splitter: UsedSigns.Splitter.StringProperty,
      zippers: [new UpperCaseZipper(), new StringZipper()],
    },
    {
      type: "number",
      splitter: UsedSigns.Splitter.NumberProperty,
      zippers: [new NumberZipper()],
    },
    {
      type: "boolean",
      splitter: UsedSigns.Splitter.BooleanProperty,
      zippers: [new BoolZipper()],
    },
  ];

  public zip(type: HandledType, source: unknown): SimpleResult | undefined {
    const operator = this.operators.find(x => x.type === type);
    if (operator) {
      let result = "";
      const { zippers } = operator;
      for (const zipper of zippers) {
        result = zipper.zip(source);
        source = result;
      }
      return {
        type: operator.type,
        splitter: operator?.splitter || "",
        value: result,
      };
    }

    return undefined;
  }

  public unzip(splitter: string, zipped: string): unknown {
    const operator = this.operators.find(x => (x.splitter = splitter));
    let result: any = zipped;
    if (operator) {
      const { zippers } = operator;
      for (const zipper of zippers) {
        result = zipper.unzip(result);
      }
    }
    return result;
  }
}
