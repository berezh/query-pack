import { UsedSigns } from "../../lib/used-signs";
import { StringZipper } from "../string";

describe("StringZipper", () => {
  const zipper = new StringZipper();

  describe("zip", () => {
    it("simple", () => {
      expect(zipper.zip("text")).toBe("text");
    });

    it("whitespace", () => {
      expect(zipper.zip("hello man")).toBe(`hello${UsedSigns.String.WhiteSpace}man`);
    });

    it("whitespace multi", () => {
      expect(zipper.zip("hello nice man")).toBe(`hello${UsedSigns.String.WhiteSpace}nice${UsedSigns.String.WhiteSpace}man`);
    });

    it("mail", () => {
      expect(zipper.zip("test@mail.com")).toBe(`test${UsedSigns.String.At}mail.com`);
    });
  });

  describe("unzip", () => {
    it("simple", () => {
      expect(zipper.unzip("text")).toBe("text");
    });

    it("whitespace", () => {
      expect(zipper.unzip(`hello${UsedSigns.String.WhiteSpace}man`)).toBe("hello man");
    });

    it("whitespace multi", () => {
      expect(zipper.unzip(`hello${UsedSigns.String.WhiteSpace}nice${UsedSigns.String.WhiteSpace}man`)).toBe("hello nice man");
    });

    it("mail", () => {
      expect(zipper.unzip(`test${UsedSigns.String.At}mail.com`)).toBe("test@mail.com");
    });
  });
});
