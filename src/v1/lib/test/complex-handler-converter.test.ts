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
    it("root", () => {
      const v = {
        id: 10,
        name: "Kent",
      };
      testZip(v, TU.full(s.Object, TU.obj(TU.p("1", v.id), TU.p("2", v.name))), {
        convertor: {
          id: 1,
          name: 2,
        },
      });
    });
    it("child", () => {
      const v = {
        name: "root",
        child: {
          id: 10,
          name: "Kent",
        },
      };
      testZip(v, TU.full(s.Object, TU.obj(TU.p("1", "root"), TU.p("2", v.child)), TU.obj(TU.p("1", v.child.id), TU.p("2", v.child.name))), {
        convertor: {
          name: 1,
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

  describe("array", () => {
    it("root", () => {
      const v = [
        {
          id: 10,
          name: "Kent",
        },
      ];
      testZip(v, TU.full(TU.a(v), TU.obj(TU.p("1", v[0].id), TU.p("2", v[0].name))), {
        convertor: {
          id: 1,
          name: 2,
        },
      });
    });
    // 1 X 1N9 Y 2A X O X 1Na Y nameSUkent
    it("child", () => {
      const v = {
        id: 9,
        child: [
          {
            id: 10,
            name: "Kent",
          },
        ],
      };
      testZip(v, TU.full(s.Object, TU.obj(TU.p("1", v.id), TU.p("2", v.child)), TU.obj(s.ObjectProperty), TU.obj(TU.p("1", v.child[0].id), TU.p("2", v.child[0].name))), {
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
