import { UsedSigns } from "./used-signs";

export class Number32 {
  // abcdefghijklmnopqrstuv
  private static numbers: Record<string, number> = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14,
    f: 15,
    g: 16,
    h: 17,
    i: 18,
    j: 19,
    k: 20,
    l: 21,
    m: 22,
    n: 23,
    o: 24,
    p: 25,
    q: 26,
    r: 27,
    s: 28,
    t: 29,
    u: 30,
    v: 31,
  };

  private static baseNumber32 = 32;

  private static toIntBase32(input: number): string {
    let result = "";
    let n = 0;
    let nBase32;
    do {
      n++;
      nBase32 = Math.pow(Number32.baseNumber32, n);
    } while (input >= nBase32);

    let rest = input;
    for (let i = n; i > 0; i--) {
      const powBase = Math.pow(Number32.baseNumber32, i - 1);
      let currNumber = Math.floor(rest / powBase);
      if (currNumber > 0) {
        rest = rest % powBase;
      } else {
        currNumber = rest;
      }
      result += Object.keys(this.numbers).find(key => this.numbers[key] === currNumber);
    }

    return result;
  }

  private static toIntNumber(base32: string): number {
    const numbers: number[] = [];

    for (const sign of base32) {
      const num = this.numbers[sign];
      if (typeof num === "number") {
        numbers.unshift(num);
      } else {
        throw Error(`"${sign}" does not belong to base32 number`);
      }
    }

    let result = 0;

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      result += num * Math.pow(Number32.baseNumber32, i);
    }

    return result;
  }

  public static toBase32(input: number): string {
    const splits = input
      .toString()
      .split(UsedSigns.FractionSeparator)
      .filter(x => !!x);
    // integer
    let result = this.toIntBase32(parseInt(splits[0]));

    if (splits.length > 1) {
      // fraction
      const fraction = this.toIntBase32(parseInt(splits[1]));
      result += UsedSigns.FractionSeparator + fraction;
    }

    return result;
  }

  public static toNumber(base32: string): number {
    const splits = base32.split(UsedSigns.FractionSeparator).filter(x => !!x);
    // integer
    let result = this.toIntNumber(splits[0]).toString();

    if (splits.length > 1) {
      // fraction
      const fraction = this.toIntNumber(splits[1]).toString();
      result += UsedSigns.FractionSeparator + fraction;
    }

    return parseFloat(result);
  }
}
