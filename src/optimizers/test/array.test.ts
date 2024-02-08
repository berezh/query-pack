import { ARRAY_ITEM_OPTIMIZER_MIN_MATCH } from "../../lib/consts";
import { Number32 } from "../../lib/number32";
import { UsedSigns } from "../../lib/used-signs";
import { ArrayOptimizer } from "../array";

const s = UsedSigns.Splitter;

describe("ArrayOptimizer", () => {
  const o = new ArrayOptimizer();

  describe("ObjectProperty", () => {
    function testObjectProperty(input: string, output: string) {
      const opt = o.pack(input);
      expect(opt).toEqual(output);
      const unopt = o.unpack(output);
      expect(unopt).toEqual(input);
    }

    it("simple", () => {
      testObjectProperty(s.ObjectProperty, s.ObjectProperty);
      testObjectProperty(s.ObjectProperty.repeat(2), s.ObjectProperty.repeat(2));
    });

    it("optimize 3-10", () => {
      for (let i = ARRAY_ITEM_OPTIMIZER_MIN_MATCH; i < 20; i++) {
        testObjectProperty(s.ObjectProperty.repeat(i), s.ObjectProperty + Number32.toBase32(i - 1));
      }
    });
  });
});

// testPack(v, TU.full(s.Object, TU.obj(TU.p("1", v.id), TU.p("2", v.name))), {
//   id: 1,
//   name: 2,
// });
