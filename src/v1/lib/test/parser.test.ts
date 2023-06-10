import { Parser } from "../parser";
import { UsedSigns } from "../used-signs";

const s = UsedSigns.Splitter;

describe("Parser", () => {
  const parser = new Parser();

  describe("convert", () => {
    it("simple", () => {
      expect(parser.splitNameSignValue("idNaYchildO", parser.propertySigns, [s.Property])).toEqual([
        ["id", "N", "a"],
        ["child", "O", ""],
      ]);
    });
  });
});
