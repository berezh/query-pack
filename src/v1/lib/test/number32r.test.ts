import { Number32 } from "../number32";

describe("Number32", () => {
  function convert(input: number, base32: string) {
    expect(Number32.toBase32(input)).toBe(base32);
    expect(Number32.toNumber(base32)).toBe(input);
  }

  describe("convert", () => {
    it("simple", () => {
      convert(0, "0");
      convert(1000, "v8");
      convert(1024, "100");
    });
    it("multi", () => {
      convert(1000000, "ugi0");
    });

    it("fraction", () => {
      convert(1000.53, "v8.1l");
    });
  });
  describe("toNumber", () => {
    it("wrong char error", () => {
      expect(() => {
        Number32.toNumber("123x");
      }).toThrowError('"x" does not belong to base32 number');
    });
  });
});
