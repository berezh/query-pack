import { ComplexHandler } from "../complex-handler";
import { UsedSigns } from "../used-signs";
import { TU } from "./tu";

const s = UsedSigns.Splitter;

interface TestObject {
  id: number;
}

interface TestContainer extends TestObject {
  child: TestObject;
}

describe.skip("ComplexHandler Array", () => {
  const handler = new ComplexHandler();

  const testZip = TU.converter(handler);

  describe("array of objects", () => {
    it("default", () => {
      const value: TestObject[] = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];
      testZip(value, [
        ComplexHandler.Version,
        s.ReferenceProperty,
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value[0].id),
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value[1].id),
      ]);
    });
  });
});
