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
      expect(parser.properties("childOYidNaYnameSjohn")).toEqual<ParsedProperty[]>([prop("O", "child"), prop("N", "id", "a"), prop("S", "name", "john")]);
      expect(parser.properties("idNaYchildOYnameSjohn")).toEqual<ParsedProperty[]>([prop("N", "id", "a"), prop("O", "child"), prop("S", "name", "john")]);
    });

    it("array", () => {
      expect(parser.properties("massA")).toEqual([prop("A", "mass")]);
    });
  });

  describe("itemAllReg", () => {
    it("simple", () => {
      expect("N2NgN40".match(parser.itemAllReg)).toBeTruthy();
    });
  });
});
