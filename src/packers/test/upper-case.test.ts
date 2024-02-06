import { UsedSigns } from "../../lib/used-signs";
import { UpperCasePacker } from "../upper-case";

describe("UpperCasePacker", () => {
  const packer = new UpperCasePacker();

  function upperCaseTest(source: string, packed: string) {
    expect(packer.pack(source)).toBe(packed);
    expect(packer.unpack(packed)).toBe(source);
  }
  describe("multi U", () => {
    it("3 upper", () => {
      upperCaseTest("IBM text", "U3ibm text");
    });
    it("pascal names", () => {
      upperCaseTest("vectorTeamIds", "vectorUteamUids");
    });
  });

  describe("pack/unpack", () => {
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
