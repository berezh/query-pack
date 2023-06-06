import { decode, encode } from "../coder";

describe("encode/decode", () => {
  it("simple", () => {
    const testString = "Hello Word!";
    const encoded = encode(testString);
    const decoded = decode(encoded);

    expect(decoded).toBe(testString);
  });
});
