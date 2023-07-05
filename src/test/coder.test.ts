import { encode, verifyLength } from "../index";
import { UsedSigns } from "../lib/used-signs";

// cases:
// 1. With cyrillic chars
// 2. With not covered chars
describe.skip("text", () => {
  it("simple", () => {
    const testString = "Hello Word!";
    const encoded = encode(testString);
    expect(encode(encoded)).toBe(`Hello${UsedSigns.String.WhiteSpace}Word!`);
    expect(encodeURIComponent(testString)).toBe("Hello%20Word!");
    expect(encodeURI(testString)).toBe("Hello%20Word!");
  });
});

describe("verifyLength", () => {
  it("simple", () => {
    expect(verifyLength("hello")).toBeTruthy();
    expect(verifyLength("hello", { maxLength: 10 })).toBeTruthy();
  });

  it("max", () => {
    expect(verifyLength("hello", { maxLength: 4 })).toBeFalsy();
  });

  it("domainOriginLength", () => {
    expect(verifyLength("hello", { maxLength: 10 })).toBeTruthy();
    expect(verifyLength("hello", { maxLength: 10, domainOriginLength: 6 })).toBeFalsy();
  });
});
