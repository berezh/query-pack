import { SimpleResult } from "../../interfaces";
import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../used-signs";

describe("SimpleHandler", () => {
  const handler = new SimpleHandler();

  function convert(input: string, result: SimpleResult) {
    expect(handler.zip(result.type, input)).toEqual<SimpleResult>(result);
    expect(handler.unzip(result.splitter, result.value)).toEqual(input);
  }

  describe("zip", () => {
    it("string + upper case", () => {
      convert("How are you?", { value: `UhowWareWyouQ`, type: "string", splitter: UsedSigns.Splitter.StringProperty });
    });
  });
});
