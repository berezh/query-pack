import { Parser } from "../parser";

describe("Parser", () => {
  const parser = new Parser();

  describe("convert", () => {
    it("simple", () => {
      expect(parser.splitNameSignValue("idNaYnameSjohn")).toEqual([
        ["N", "id", "a"],
        ["S", "name", "john"],
      ]);
    });

    it("object", () => {
      expect(parser.splitNameSignValue("childOidNaYnameSjohn")).toEqual([
        ["O", "child"],
        ["N", "id", "a"],
        ["S", "name", "john"],
      ]);
      expect(parser.splitNameSignValue("idNaYchildOnameSjohn")).toEqual([
        ["N", "id", "a"],
        ["O", "child"],
        ["S", "name", "john"],
      ]);
    });

    it("array", () => {
      expect(parser.splitNameSignValue("massAN1N2")).toEqual([["A", "mass", "N", "1", "N", "2"]]);
    });
  });
});
