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

  function testZip(input: any, zipped: string) {
    const zipResult = handler.zip(input);
    expect(zipResult).toEqual(zipped);
    expect(handler.unzip(zipped)).toEqual(input);
  }

  describe("container", () => {
    it("1 child", () => {
      const value: TestContainer = {
        id: 10,
        child: {
          id: 11,
        },
      };
      testZip(value, TU.full(ComplexHandler.Version, TU.obj(TU.propN("id", value.id), TU.r("child")), TU.obj(TU.propN("id", value.child.id))));
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
      testZip(
        value,
        TU.full(ComplexHandler.Version, TU.obj(TU.p("id", value.id), TU.r("first"), TU.r("second")), TU.obj(TU.p("id", value.first.id)), TU.obj(true, TU.p("id", value.second.id)))
      );
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
      testZip(
        value,
        TU.full(
          ComplexHandler.Version,
          TU.obj(TU.propN("id", value.id), TU.r("first")),
          TU.obj(TU.propN("id", value.first.id), TU.r("second")),
          TU.obj(true, TU.propN("id", value.first.second.id))
        )
      );
    });

    // 1, 3, 2
    it("2 child & 2 deep", () => {
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
      testZip(
        value,
        TU.full(
          ComplexHandler.Version,
          TU.obj(TU.propN("id", value.id), TU.r("first"), TU.r("third")),
          TU.obj(TU.propN("id", value.first.id), TU.r("second")),
          TU.obj(TU.propN("id", value.third.id)),
          TU.obj(true, TU.propN("id", value.first.second.id))
        )
      );
    });

    it("2 child & 4, 4 deep", () => {
      const value = {
        id: 0,
        first: {
          id: 1,
          second: {
            id: 2,
            third: {
              id: 3,
            },
          },
          forth: {
            id: 4,
            five: {
              id: 5,
            },
          },
        },
        six: {
          id: 6,
          seven: {
            id: 7,
            eight: {
              id: 8,
            },
          },
          nine: {
            id: 9,
            ten: {
              id: 10,
            },
          },
        },
      };
      testZip(
        value,
        TU.full(
          ComplexHandler.Version,
          TU.obj(TU.p("id", value.id), TU.r("first"), TU.r("six")),
          TU.obj(TU.p("id", value.first.id), TU.r("second"), TU.r("forth")),
          TU.obj(TU.p("id", value.six.id), TU.r("seven"), TU.r("nine")),
          TU.obj(TU.p("id", value.first.second.id), TU.r("third")),
          TU.obj(TU.p("id", value.first.forth.id), TU.r("five")),
          TU.obj(TU.p("id", value.six.seven.id), TU.r("eight")),
          TU.obj(TU.p("id", value.six.nine.id), TU.r("ten")),
          TU.obj(TU.p("id", value.first.second.third.id)),
          TU.obj(TU.p("id", value.first.forth.five.id)),
          TU.obj(TU.p("id", value.six.seven.eight.id)),
          TU.obj(TU.p("id", value.six.nine.ten.id))
        )
      );
    });
  });
});
