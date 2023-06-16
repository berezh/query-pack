import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

const s = UsedSigns.Splitter;

export class NullZipper extends Zipper<null> {
  public zip(source: null): string {
    if (source === null) {
      return s.NullProperty;
    }

    return "";
  }

  public unzip(zipped: string): null {
    if (zipped === s.NullProperty) {
      return null;
    }

    return null;
  }
}
