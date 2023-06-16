import { ZippedValue } from "../../interfaces";
import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../used-signs";

const s = UsedSigns.Splitter;

describe("SimpleHandler", () => {
  const handler = new SimpleHandler();

  function convert(input: string, result: string) {
    // result: ZippedValue) {
    expect(handler.zip("string", input)).toEqual<ZippedValue>({ value: result, type: "string", splitter: s.StringProperty });
    const unzipValue = handler.unzip(s.StringProperty, result);
    expect(unzipValue).toEqual(input);
  }

  describe("string", () => {
    it("string + upper case", () => {
      convert("How are you?", "UhowWareWyouQ");
    });

    it("empty", () => {
      convert("", "");
    });
  });
});
