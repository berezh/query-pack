import { BasicPacker } from "./basic";

export class BooleanPacker extends BasicPacker<boolean> {
  public pack(source: boolean): string {
    return source === true ? "1" : "0";
  }

  public unpack(packed: string): boolean {
    return packed === "1" ? true : false;
  }
}
