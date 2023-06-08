import { Zipper } from "./zipper";

export class NumberZipper extends Zipper<number> {
  public zip(source: number): string {
    const result = "";

    return result;
  }

  public unzip(zipped: string): number {
    return parseFloat(zipped);
  }
}
