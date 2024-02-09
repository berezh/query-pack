import { AvmsUtil } from "./avms-util";
import { BasicOptimizer } from "./basic";

export abstract class BasicValueOptimizer extends BasicOptimizer {
  protected readonly splitter: string;

  protected readonly packReg: RegExp;

  protected readonly unpackReg: RegExp;

  constructor(splitter: string, packReq: RegExp, unpackReq: RegExp) {
    super();
    this.splitter = splitter;
    this.packReg = packReq;
    this.unpackReg = unpackReq;
  }

  public pack(input: string): string {
    if (input.match(this.packReg)) {
      return input.replace(this.packReg, match => {
        const parsedObject = AvmsUtil.parsePack(this.splitter, match);
        return this.splitter.repeat(1 + parsedObject.valueLength) + parsedObject.values.join("");
      });
    }

    return input;
  }

  public unpack(input: string): string {
    if (input.match(this.unpackReg)) {
      return input.replace(this.unpackReg, match => {
        const parsedObject = AvmsUtil.parseUnpack(this.splitter, match);
        return parsedObject.values.map(v => this.splitter + v).join("");
      });
    }

    return input;
  }
}
