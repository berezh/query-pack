import { Zipper } from "./zipper";

export class NumberZipper extends Zipper<number> {
  public zip(source: number): string {
    return source.toString();
  }

  public unzip(zipped: string): number {
    return parseFloat(zipped);
  }

  // abcdefg hijklmnopqrstuvwxyz
  private numbers: Record<number, string> = {
    0: "0",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "a",
    11: "b",
    12: "c",
    13: "d",
    14: "e",
    15: "f",
    16: "g",
    17: "h",
    18: "i",
    19: "j",
    20: "k",
    21: "l",
    22: "m",
    23: "n",
    24: "o",
    25: "p",
    26: "q",
    27: "r",
    28: "s",
    29: "t",
    30: "u",
    31: "v",
  };
}
