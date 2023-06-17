import { ZippedRefPosition } from "../interfaces";

export class ObjectPosition {
  private deep: number[] = [];

  public reset(): ZippedRefPosition {
    this.deep = [];
    return {
      level: 0,
      levelIndex: 0,
      itemIndex: 0,
    };
  }

  public level(p: ZippedRefPosition): ZippedRefPosition {
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

  public index(p: ZippedRefPosition, index: number): ZippedRefPosition {
    return {
      ...p,
      itemIndex: index,
    };
  }
}