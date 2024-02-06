import { Number32 } from "../lib/number32";
import { BasicPacker } from "./basic";

export class NumberPacker extends BasicPacker<number> {
  public pack(source: number): string {
    return Number32.toBase32(source);
  }

  public unpack(packed: string): number {
    return Number32.toNumber(packed);
  }
}
