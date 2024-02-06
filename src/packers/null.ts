import { UsedSigns } from "../lib/used-signs";
import { BasicPacker } from "./basic";

const s = UsedSigns.Splitter;

export class NullPacker extends BasicPacker<null> {
  public pack(source: null): string {
    if (source === null) {
      return s.NullProperty;
    }

    return "";
  }

  public unpack(packed: string): null {
    if (packed === s.NullProperty) {
      return null;
    }

    return null;
  }
}
