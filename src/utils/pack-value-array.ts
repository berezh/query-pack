import { PackType } from "../interfaces";
import { TypeUtil } from "../lib/type";

interface PackValueItem {
  value: any;
  type: PackType | undefined;
  masterCount: number;
  isSlave: boolean;
}

export class PackValueArray {
  private packedItems: PackValueItem[] = [];

  constructor(array: any[]) {
    for (const value of array) {
      const type = TypeUtil.getType(value);
      const item: PackValueItem = {
        value,
        type,
        masterCount: 0,
        isSlave: false,
      };
      const master = this.getLastMaster(type);
      if (master) {
        master.masterCount++;
        item.isSlave = true;
      }
      this.packedItems.push(item);
    }
  }

  private getLastMaster(type: PackType | undefined): PackValueItem | undefined {
    let result: PackValueItem | undefined = undefined;
    if (type) {
      for (let i = this.packedItems.length - 1; i >= 0; i--) {
        const item = this.packedItems[i];
        if (item.type === type) {
          result = item;
        } else {
          break;
        }
      }
    }
    return result;
  }
}
