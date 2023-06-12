import { ComplexResultPosition } from "../interfaces";

export class ObjectPosition {
  private static deep: number[];

  public static create(): ComplexResultPosition {
    ObjectPosition.deep = [];
    return {
      level: 0,
      levelIndex: 0,
      itemIndex: 0,
    };
  }

  public static level(p: ComplexResultPosition): ComplexResultPosition {
    const level = p.level + 1;

    let levelIndex = 0;
    if (ObjectPosition.deep.length <= level) {
      while (ObjectPosition.deep.length <= level) {
        ObjectPosition.deep.push(0);
      }
    } else {
      levelIndex = ObjectPosition.deep[level] = ObjectPosition.deep[level] + 1;
    }

    return {
      ...p,
      level,
      levelIndex,
    };
  }

  public static index(p: ComplexResultPosition, index: number): ComplexResultPosition {
    return {
      ...p,
      itemIndex: index,
    };
  }
}
