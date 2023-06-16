import { UsedSigns } from "../lib/used-signs";
import { Zipper } from "./zipper";

const s = UsedSigns.Splitter;

export class UndefinedZipper extends Zipper<undefined> {
  public zip(source: undefined): string {
    if (source === undefined) {
      return s.UndefinedProperty;
    }

    return "";
  }

  public unzip(zipped: string): undefined {
    if (zipped === s.UndefinedProperty) {
      return undefined;
    }

    return undefined;
  }
}
