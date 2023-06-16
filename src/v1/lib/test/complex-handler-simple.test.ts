import { ComplexHandler } from "../complex-handler";
import { UsedSigns } from "../used-signs";
import { TU } from "./tu";

const s = UsedSigns.Splitter;

describe.skip("ComplexHandler Simple", () => {
  const handler = new ComplexHandler();

  const convert = TU.converter(handler);

  describe("string", () => {
    it("default", () => {
      convert("", TU.full(s.StringProperty));
    });
  });
});
