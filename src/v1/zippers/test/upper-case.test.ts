import { UsedSigns } from "../../lib/used-signs";
import { UpperCaseZipper } from "../upper-case";

describe("UpperCaseZipper", () => {
  const zipper = new UpperCaseZipper();

  function upperCaseTest(source: string, zipped: string) {
    expect(zipper.zip(source)).toBe(zipped);
    expect(zipper.unzip(zipped)).toBe(source);
  }
  describe("multi U", () => {
    it("3 upper", () => {
      upperCaseTest("IBM text", "U3ibm text");
    });
    it("pascal names", () => {
      upperCaseTest("vectorTeamIds", "vectorUteamUids");
    });
  });

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
      upperCaseTest("what is PS?", `what is ${UsedSigns.UpperCase}2ps?`);
    });

    it("abbreviation 3", () => {
      upperCaseTest("what is DNS?", `what is ${UsedSigns.UpperCase}3dns?`);
    });

    it("abbreviation 4", () => {
      upperCaseTest("what is HTML$?", `what is ${UsedSigns.UpperCase}4html$?`);
    });

    it("U issue", () => {
      upperCaseTest("uuu UUU uu", `uuu ${UsedSigns.UpperCase}3uuu uu`);
    });
  });
});

// vectorTeamIds => vectorTEAMids => vectorUteamUids
