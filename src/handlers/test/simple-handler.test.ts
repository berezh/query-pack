import { PackedValue } from "../../interfaces";
import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../../lib/used-signs";

const s = UsedSigns.Splitter;

describe("SimpleHandler", () => {
  const handler = new SimpleHandler();

  function convert(input: string, result: string) {
    // result: ZippedValue) {
    const curZipped = handler.zip("string", input);
    expect(curZipped).toEqual<PackedValue>({ value: result, type: "string", splitter: s.StringProperty });
    const unzipValue = handler.unzip(s.StringProperty, result);
    expect(unzipValue).toEqual(input);
  }

  describe("string", () => {
    it("string + upper case", () => {
      convert("Hey, how are you?", "UheyCWhowWareWyouQ");
      convert("How are you?", "UhowWareWyouQ");
    });

    it("empty", () => {
      convert("", "E");
    });
  });
});
