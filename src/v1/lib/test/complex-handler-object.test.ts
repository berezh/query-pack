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
    const zipResult = handler.zip(input);
    expect(zipResult).toEqual(zipped.join(""));
    expect(handler.unzip(zipped.join(""))).toEqual(input);
  }

  describe("container", () => {
    it("1 child", () => {
      const value: TestContainer = {
        id: 10,
        child: {
          id: 11,
        },
      };
      testZip(value, [
        ComplexHandler.Version,
        "id",
        s.NumberProperty,
        TU.zipN(value.id),
        s.Property,
        "child",
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.child.id),
      ]);
    });

    it("2 child", () => {
      const value = {
        id: 10,
        first: {
          id: 11,
        },
        second: {
          id: 12,
        },
      };
      testZip(value, [
        ComplexHandler.Version,
        "id",
        s.NumberProperty,
        TU.zipN(value.id),
        s.Property,
        "first",
        s.ReferenceProperty,
        s.Property,
        "second",
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.first.id),
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.second.id),
      ]);
    });

    it("2 deep", () => {
      const value = {
        id: 10,
        first: {
          id: 11,
          second: {
            id: 12,
          },
        },
      };
      testZip(value, [
        ComplexHandler.Version,
        "id",
        s.NumberProperty,
        TU.zipN(value.id),
        s.Property,
        "first",
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.first.id),
        s.Property,
        "second",
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.first.second.id),
      ]);
    });

    // 1idN0YfirstRYthirdRXidN1YsecondRXidN2XidN3
    // 1, 3, 2
    it.skip("2 child & 2 deep", () => {
      const value = {
        id: 0,
        first: {
          id: 1,
          second: {
            id: 2,
          },
        },
        third: {
          id: 3,
        },
      };
      testZip(value, [
        ComplexHandler.Version,
        "id",
        s.NumberProperty,
        TU.zipN(value.id),
        s.Property,
        "first",
        s.ReferenceProperty,
        s.Property,
        "third",
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.first.id),
        s.Property,
        "second",
        s.ReferenceProperty,
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.first.second.id),
        s.Object,
        "id",
        s.NumberProperty,
        TU.zipN(value.third.id),
      ]);
    });
  });
});
