import { BooleanPacker } from "../packers/boolean";
import { NullPacker } from "../packers/null";
import { NumberPacker } from "../packers/number";
import { StringPacker } from "../packers/string";
import { UndefinedPacker } from "../packers/undefined";
import { UpperCasePacker } from "../packers/upper-case";
import { BasicPacker } from "../packers/basic";
import { UsedSigns } from "../lib/used-signs";
import { PackType, PackedValue } from "../interfaces";

const s = UsedSigns.Splitter;

interface TypeOperator {
  type: PackType;
  splitter: string;
  packers: BasicPacker[];
  unpackers?: BasicPacker[];
}

export class SimpleHandler {
  private upperCasePacker = new UpperCasePacker();

  private stringPacker = new StringPacker();

  private operators: TypeOperator[] = [
    {
      type: "string",
      splitter: s.StringProperty,
      packers: [this.upperCasePacker, this.stringPacker],
      unpackers: [this.stringPacker, this.upperCasePacker],
    },
    {
      type: "number",
      splitter: s.NumberProperty,
      packers: [new NumberPacker()],
    },
    {
      type: "boolean",
      splitter: s.BooleanProperty,
      packers: [new BooleanPacker()],
    },
    {
      type: "null",
      splitter: s.NullProperty,
      packers: [new NullPacker()],
    },
    {
      type: "undefined",
      splitter: s.UndefinedProperty,
      packers: [new UndefinedPacker()],
    },
  ];

  public pack(type: PackType, source: unknown): PackedValue | undefined {
    const operator = this.operators.find(x => x.type === type);
    if (operator) {
      let result = source;
      const { packers } = operator;
      for (const packer of packers) {
        result = packer.pack(result);
      }
      return {
        type: operator.type,
        splitter: operator?.splitter || "",
        value: result as string,
      };
    }

    return undefined;
  }

  public unpack<T = unknown>(splitter: string, packed: string): T {
    const operator = this.operators.find(x => x.splitter === splitter);
    let result: any = packed;
    if (operator) {
      const { unpackers, packers } = operator;
      for (const packer of unpackers || packers) {
        result = packer.unpack(result);
      }
    }
    return result;
  }
}
