import { UsedSigns } from "../../lib/used-signs";
import { UpperCaseZipper } from "../upper-case";

describe("UpperCaseZipper", () => {
  const zipper = new UpperCaseZipper();

  describe("zip", () => {
    it("none", () => {
      expect(zipper.zip("text")).toBe("text");
    });

    it("1", () => {
      expect(zipper.zip("Text")).toBe(`${UsedSigns.UpperCase}text`);
    });

    it("multi", () => {
      expect(zipper.zip("Hello Nice Man")).toBe(`${UsedSigns.UpperCase}hello ${UsedSigns.UpperCase}nice ${UsedSigns.UpperCase}man`);
    });
  });

  describe("unzip", () => {
    it("none", () => {
      expect(zipper.unzip("text")).toBe("text");
    });

    it("1", () => {
      expect(zipper.unzip(`${UsedSigns.UpperCase}text`)).toBe("Text");
    });

    it("multi", () => {
      expect(zipper.unzip(`${UsedSigns.UpperCase}hello ${UsedSigns.UpperCase}nice ${UsedSigns.UpperCase}man`)).toBe("Hello Nice Man");
    });
  });
});
