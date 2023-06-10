import { Parser } from "../parser";

describe("Parser", () => {
  const parser = new Parser();

  describe("convert", () => {
    it("simple", () => {
      expect(parser.splitNameSignValue("idNaYchildO")).toEqual([
        ["id", "N", "a"],
        ["child", "O", ""],
      ]);
    });
  });
});
