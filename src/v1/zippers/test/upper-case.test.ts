import { UsedSigns } from "../../lib/used-signs";
import { UpperCaseZipper } from "../upper-case";

describe("UpperCaseZipper", () => {
  const zipper = new UpperCaseZipper();

  function upperCaseTest(source: string, zipped: string) {
    expect(zipper.zip(source)).toBe(zipped);
    expect(zipper.unzip(zipped)).toBe(source);
  }

  describe("zip/unzip", () => {
    it("none", () => {
      upperCaseTest("text", "text");
    });

    it("1", () => {
      upperCaseTest("Text", `${UsedSigns.UpperCase}text`);
    });

    it("multi", () => {
      upperCaseTest("Hello Nice Man", `${UsedSigns.UpperCase}hello ${UsedSigns.UpperCase}nice ${UsedSigns.UpperCase}man`);
    });

    it("abbreviation 2", () => {
      upperCaseTest("what is PS?", `what is ${UsedSigns.UpperCase}ps${UsedSigns.UpperCase}?`);
    });

    it("abbreviation 3", () => {
      upperCaseTest("what is DNS?", `what is ${UsedSigns.UpperCase}dns${UsedSigns.UpperCase}?`);
    });

    it("abbreviation 4", () => {
      upperCaseTest("what is HTML?", `what is ${UsedSigns.UpperCase}html${UsedSigns.UpperCase}?`);
    });

    it("U issue", () => {
      upperCaseTest("uuu UUU uu", `uuu ${UsedSigns.UpperCase}uuu${UsedSigns.UpperCase} uu`);
    });
  });
});
