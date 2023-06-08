import { encode } from "../coder";
import { UsedSigns } from "../lib/used-signs";

describe("text", () => {
  it("simple", () => {
    const testString = "Hello Word!";
    const encoded = encode(testString);
    expect(encode(encoded)).toBe(`Hello${UsedSigns.String.WhiteSpace}Word!`);
    console.log(encodeURI(testString));
    expect(encodeURIComponent(testString)).toBe("Hello%20Word!");
    expect(encodeURI(testString)).toBe("Hello%20Word!");
  });
});
