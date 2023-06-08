import { Zipper } from "./zipper";

export class ObjectZipper extends Zipper<object> {
  public zip(source: object): string {
    throw new Error("Method not implemented.");
  }

  public unzip(zipped: string): object {
    throw new Error("Method not implemented.");
  }
}
