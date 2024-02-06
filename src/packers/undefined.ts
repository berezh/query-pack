import { UsedSigns } from "../lib/used-signs";
import { BasicPacker } from "./basic";

const s = UsedSigns.Splitter;

export class UndefinedPacker extends BasicPacker<undefined> {
  public pack(source: undefined): string {
    if (source === undefined) {
      return s.UndefinedProperty;
    }

    return "";
  }

  public unpack(packed: string): undefined {
    if (packed === s.UndefinedProperty) {
      return undefined;
    }

    return undefined;
  }
}
