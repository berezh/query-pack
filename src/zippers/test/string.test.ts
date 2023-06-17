import { UsedSigns } from "../../lib/used-signs";
import { StringZipper } from "../string";

describe("StringZipper", () => {
  const zipper = new StringZipper();

  function stringTest(source: string, zipped: string) {
    const curZipped = zipper.zip(source);
    expect(curZipped).toBe(zipped);
    expect(zipper.unzip(zipped)).toBe(source);
  }

  describe("zip/unzip", () => {
    it("simple", () => {
      stringTest("text", "text");
    });

    it("whitespace", () => {
      stringTest("hello man", `hello${UsedSigns.String.WhiteSpace}man`);
    });

    it("whitespace multi", () => {
      stringTest("hello nice man", `hello${UsedSigns.String.WhiteSpace}nice${UsedSigns.String.WhiteSpace}man`);
    });

    it("mail", () => {
      stringTest("test@mail.com", `test${UsedSigns.String.At}mail.com`);
    });
  });
});
