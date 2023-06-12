import { ComplexResultPosition } from "../../interfaces";
import { ObjectPosition } from "../object-position";

describe("ObjectPosition", () => {
  function positionEqual(expected: ComplexResultPosition, actual: ComplexResultPosition) {
    expect(expected).toEqual<ComplexResultPosition>(actual);
  }

  describe("cycle", () => {
    it("root", () => {
      const root = ObjectPosition.create();
      positionEqual(root, {
        level: 0,
        levelIndex: 0,
        itemIndex: 0,
      });
    });

    it("level", () => {
      const root = ObjectPosition.create();

      // level 1
      // levelIndex 0
      const level1_0 = ObjectPosition.level(root);
      positionEqual(level1_0, {
        level: 1,
        levelIndex: 0,
        itemIndex: 0,
      });

      // level 1
      // levelIndex 1
      const level1_1 = ObjectPosition.level(root);
      positionEqual(level1_1, {
        level: 1,
        levelIndex: 1,
        itemIndex: 0,
      });

      // level 1
      // levelIndex 2
      const level1_2 = ObjectPosition.level(root);
      positionEqual(level1_2, {
        level: 1,
        levelIndex: 2,
        itemIndex: 0,
      });
    });

    it("index", () => {
      const root = ObjectPosition.create();
      const level1 = ObjectPosition.level(root);

      // index 0
      positionEqual(ObjectPosition.index(level1, 0), {
        level: 1,
        levelIndex: 0,
        itemIndex: 0,
      });
      // index 0
      positionEqual(ObjectPosition.index(level1, 1), {
        level: 1,
        levelIndex: 0,
        itemIndex: 1,
      });
      positionEqual(ObjectPosition.index(level1, 2), {
        level: 1,
        levelIndex: 0,
        itemIndex: 2,
      });
    });
  });
});
