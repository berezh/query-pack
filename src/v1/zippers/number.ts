import { Number32 } from "../lib/number32";
import { Zipper } from "./zipper";

export class NumberZipper extends Zipper<number> {
  public zip(source: number): string {
    return Number32.toBase32(source);
  }

  public unzip(zipped: string): number {
    return Number32.toNumber(zipped);
  }
}
