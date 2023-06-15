import { ZipOptions } from "../../interfaces";
import { ComplexHandler } from "../complex-handler";
import { UsedSigns } from "../used-signs";
import { TU } from "./tu";

const s = UsedSigns.Splitter;

describe("ComplexHandler Converter", () => {
  function testZip(input: any, zipped: string, options: ZipOptions) {
    const handler = new ComplexHandler(options);
    const zipResult = handler.zip(input);
    expect(zipResult).toEqual(zipped);
    expect(handler.unzip(zipped)).toEqual(input);
  }

  describe("object", () => {
    it("empty", () => {
      const value = {
        id: 10,
        name: "Kent",
      };
      testZip(value, TU.full(s.Object, TU.obj(TU.p("1", value.id), TU.p("2", value.name))), {
        convertor: {
          id: 1,
          name: 2,
        },
      });
    });
  });

  describe("array", () => {
    it("root", () => {
      const value = [
        {
          id: 10,
          name: "Kent",
        },
      ];
      testZip(value, TU.full(TU.a(value), TU.obj(TU.p("1", value[0].id), TU.p("2", value[0].name))), {
        convertor: {
          id: 1,
          name: 2,
        },
      });
    });
    // 1 X 1N9Y2A X O X 1Na Y nameSUkent
    it.skip("child", () => {
      const value = {
        id: 9,
        child: [
          {
            id: 10,
            name: "Kent",
          },
        ],
      };
      testZip(value, TU.full(s.Object, TU.p("1", value.id), TU.p("2", value.child), TU.obj(TU.p("1", value.child[0].id), TU.p("2", value.child[0].name))), {
        convertor: {
          id: 1,
          child: [
            2,
            {
              id: 1,
              name: 2,
            },
          ],
        },
      });
    });
  });
});
