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

describe("ComplexHandler Object", () => {
  const handler = new ComplexHandler();

  function testZip(input: any, zipped: (string | undefined | number)[]) {
    // expect(handler.zip(input)).toEqual(zipped.join(""));
    expect(handler.unzip(zipped.join(""))).toEqual(input);
  }

  describe("container", () => {
    it("default", () => {
      const value: TestContainer = {
        id: 10,
        child: {
          id: 11,
        },
      };
      testZip(value, [
        ComplexHandler.Version,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.id),
        s.Property,
        "child",
        s.ObjectProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.child.id),
      ]);
    });
  });
});
