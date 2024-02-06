import { PackedRefPosition } from "../interfaces";

export class ObjectPosition {
  private deep: number[] = [];

  public reset(): PackedRefPosition {
    this.deep = [];
    return {
      level: 0,
      levelIndex: 0,
      itemIndex: 0,
    };
  }

  public level(p: PackedRefPosition): PackedRefPosition {
    const level = p.level + 1;

    let levelIndex = 0;
    if (this.deep.length <= level) {
      while (this.deep.length <= level) {
        this.deep.push(0);
      }
    } else {
      levelIndex = this.deep[level] = this.deep[level] + 1;
    }

    return {
      ...p,
      level,
      levelIndex,
    };
  }

  public index(p: PackedRefPosition, index: number): PackedRefPosition {
    return {
      ...p,
      itemIndex: index,
    };
  }
}
