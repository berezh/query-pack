import { CommonUtil } from "../common";

describe("CommonUtil", () => {
  describe("order", () => {
    const numberArray = [3, 5, 2, 1, 6, 7, 8, 9, 4];
    it("default", () => {
      expect(CommonUtil.order(numberArray, [x => x])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("asc", () => {
      expect(CommonUtil.order(numberArray, [x => x, "asc"])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("desc", () => {
      expect(CommonUtil.order(numberArray, [x => x, "desc"])).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });
  });

  describe("order object", () => {
    const objectArray: [number, number][] = [
      [2, 1],
      [1, 2],
      [2, 1],
      [1, 1],
      [2, 2],
    ];

    it("asc", () => {
      const res = CommonUtil.order(objectArray, [x => x[1], "asc"], [x => x[0], "asc"]);
      expect(res).toEqual([
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 1],
        [2, 2],
      ]);
    });
    it("desc", () => {
      const res = CommonUtil.order(objectArray, [x => x[1], "desc"], [x => x[0], "desc"]);
      expect(res).toEqual([
        [2, 2],
        [2, 1],
        [2, 1],
        [1, 2],
        [1, 1],
      ]);
    });
  });
});
