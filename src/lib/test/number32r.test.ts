import { Number32 } from "../number32";

describe("Number32", () => {
  function convert(input: number, base32: string) {
    const curZipped = Number32.toBase32(input);
    expect(curZipped).toBe(base32);
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

    it("fraction 2", () => {
      convert(123456.789, "3oi0.ol");
    });
  });
  describe("toNumber", () => {
    it("wrong char error", () => {
      expect(() => {
        Number32.toNumber("123x");
      }).toThrowError('"x" does not belong to base32 number');
    });
  });
  describe("isBase32", () => {
    it("default", () => {
      expect(Number32.isBase32("0")).toBeTruthy();
      expect(Number32.isBase32("bc")).toBeTruthy();
    });
    it("minus", () => {
      expect(Number32.isBase32("-10")).toBeTruthy();
    });
    it("fraction", () => {
      expect(Number32.isBase32("10.abc")).toBeTruthy();
    });
    it("no", () => {
      expect(Number32.isBase32("")).toBeFalsy();
      expect(Number32.isBase32("1x")).toBeFalsy();
      expect(Number32.isBase32("y")).toBeFalsy();
    });
  });
});
