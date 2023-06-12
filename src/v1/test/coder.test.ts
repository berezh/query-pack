import { zip } from "../index";
import { UsedSigns } from "../lib/used-signs";

describe.skip("text", () => {
  it("simple", () => {
    const testString = "Hello Word!";
    const encoded = zip(testString);
    expect(zip(encoded)).toBe(`Hello${UsedSigns.String.WhiteSpace}Word!`);
    expect(encodeURIComponent(testString)).toBe("Hello%20Word!");
    expect(encodeURI(testString)).toBe("Hello%20Word!");
  });
});
