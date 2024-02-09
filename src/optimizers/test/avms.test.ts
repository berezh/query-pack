import { AvmsParsedString, AvmsUtil } from "../avms-util";

describe("AvmsUtil", () => {
  describe("parsePack", () => {
    function testParse(splitter: string, input: string, valueLength: number, values: string[]) {
      const parseObject = AvmsUtil.parsePack(splitter, input);
      expect(parseObject).toEqual<AvmsParsedString>({
        splitter,
        valueLength,
        values,
      });
    }

    it("simple: value 1", () => {
      testParse("N", "N1N2", 1, ["1", "2"]);
    });

    it("simple: value 2", () => {
      testParse("N", "N12N34", 2, ["12", "34"]);
    });

    it("simple: value 3", () => {
      testParse("N", "N123N456", 3, ["123", "456"]);
    });
  });

  describe("parseUnpack", () => {
    function testParse(splitter: string, input: string, valueLength: number, values: string[]) {
      const parseObject = AvmsUtil.parseUnpack(splitter, input);
      expect(parseObject).toEqual<AvmsParsedString>({
        splitter,
        valueLength,
        values,
      });
    }

    it("simple: value 1", () => {
      testParse("N", "NN12", 1, ["1", "2"]);
    });

    it("simple: value 2", () => {
      testParse("N", "NNN1234", 2, ["12", "34"]);
    });

    it("simple: value 3", () => {
      testParse("N", "NNNN123456", 3, ["123", "456"]);
    });
  });
});
