import { ParsedProperty } from "../../interfaces";
import { Parser } from "../parser";

describe("Parser", () => {
  const parser = new Parser();

  function prop(splitter: string, name: string, value = ""): ParsedProperty {
    return {
      splitter,
      name,
      value,
      type: parser.getType(splitter),
    };
  }

  describe("properties", () => {
    it("simple", () => {
      expect(parser.properties("idNaYnameSjohn")).toEqual<ParsedProperty[]>([prop("N", "id", "a"), prop("S", "name", "john")]);
    });

    it("object", () => {
      expect(parser.properties("childRYidNaYnameSjohn")).toEqual<ParsedProperty[]>([prop("R", "child"), prop("N", "id", "a"), prop("S", "name", "john")]);
      expect(parser.properties("idNaYchildRYnameSjohn")).toEqual<ParsedProperty[]>([prop("N", "id", "a"), prop("R", "child"), prop("S", "name", "john")]);
    });

    it("array", () => {
      expect(parser.properties("massR")).toEqual([prop("R", "mass")]);
    });
  });

  describe("itemAllReg", () => {
    it("simple", () => {
      expect("N2NgN40".match(parser.itemAllReg)).toBeTruthy();
    });
  });
});
