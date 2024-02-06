import { UsedSigns } from "../../lib/used-signs";
import { StringPacker } from "../string";

describe("StringPacker", () => {
  const packer = new StringPacker();

  function stringTest(source: string, packed: string) {
    const curPacked = packer.pack(source);
    expect(curPacked).toBe(packed);
    expect(packer.unpack(packed)).toBe(source);
  }

  describe("pack/unpack", () => {
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
