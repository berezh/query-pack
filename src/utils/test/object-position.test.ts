import { PackedRefPosition } from "../../interfaces";
import { ObjectPosition } from "../object-position";

describe("ObjectPosition", () => {
  const op = new ObjectPosition();

  function positionEqual(expected: PackedRefPosition, actual: PackedRefPosition) {
    expect(expected).toEqual<PackedRefPosition>(actual);
  }

  describe("cycle", () => {
    it("root", () => {
      const root = op.reset();
      positionEqual(root, {
        level: 0,
        levelIndex: 0,
        itemIndex: 0,
      });
    });

    it("level", () => {
      const root = op.reset();

      // level 1
      // levelIndex 0
      const level1_0 = op.level(root);
      positionEqual(level1_0, {
        level: 1,
        levelIndex: 0,
        itemIndex: 0,
      });

      // level 1
      // levelIndex 1
      const level1_1 = op.level(root);
      positionEqual(level1_1, {
        level: 1,
        levelIndex: 1,
        itemIndex: 0,
      });

      // level 1
      // levelIndex 2
      const level1_2 = op.level(root);
      positionEqual(level1_2, {
        level: 1,
        levelIndex: 2,
        itemIndex: 0,
      });
    });

    it("index", () => {
      const root = op.reset();
      const level1 = op.level(root);

      // index 0
      positionEqual(op.index(level1, 0), {
        level: 1,
        levelIndex: 0,
        itemIndex: 0,
      });
      // index 0
      positionEqual(op.index(level1, 1), {
        level: 1,
        levelIndex: 0,
        itemIndex: 1,
      });
      positionEqual(op.index(level1, 2), {
        level: 1,
        levelIndex: 0,
        itemIndex: 2,
      });
    });
  });
});
