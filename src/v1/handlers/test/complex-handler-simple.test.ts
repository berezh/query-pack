import { ComplexHandler } from "../../handlers/complex-handler";
import { TU } from "../../lib/test/tu";
import { UsedSigns } from "../../lib/used-signs";

const s = UsedSigns.Splitter;

describe("ComplexHandler Simple", () => {
  const handler = new ComplexHandler();

  const convert = TU.converter(handler);

  describe("string", () => {
    it("empty", () => {
      convert("", TU.full(s.StringProperty + UsedSigns.EmptyString));
    });
    it("undefined", () => {
      convert(undefined, TU.full(s.UndefinedProperty));
    });
    it("null", () => {
      convert(null, TU.full(s.NullProperty));
    });
    it("object empty", () => {
      convert({ name: "" }, TU.full(s.Object, TU.p("name", "")));
    });
  });
});
