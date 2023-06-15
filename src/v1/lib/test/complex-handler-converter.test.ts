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

  function testCycle(source: any, options: ZipOptions) {
    const handler = new ComplexHandler(options);
    const zipped = handler.zip(source);
    const unzipped = handler.unzip(zipped);
    expect(source).toEqual(unzipped);
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
      testCycle(v, {
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
    it("many child", () => {
      testCycle(
        {
          name: "root",
          child1: {
            id: 1,
            name: "Kent",
          },
          child2: {
            id: 2,
            name: "Dana",
            child3: {
              id: 3,
              name: "Pepe",
            },
          },
        },
        {
          convertor: {
            name: 1,
            child1: [
              2,
              {
                id: 1,
                name: 2,
              },
            ],
            child2: [
              3,
              {
                id: 1,
                name: 2,
                child3: [
                  3,
                  {
                    id: 1,
                    name: 2,
                  },
                ],
              },
            ],
          },
        }
      );
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
      testCycle(v, {
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
      testCycle(v, {
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
