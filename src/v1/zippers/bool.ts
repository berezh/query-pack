import { Zipper } from "./zipper";

export class BoolZipper extends Zipper<boolean> {
  public zip(source: boolean): string {
    return source === true ? "1" : "0";
  }

  public unzip(zipped: string): boolean {
    return zipped === "1" ? true : false;
  }
}
