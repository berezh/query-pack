import { ZipFieldConvertor } from "../../interfaces";
import { ComplexHandler } from "../../handlers/complex-handler";
import { TU } from "../../lib/test/tu";
import { UsedSigns } from "../../lib/used-signs";

const s = UsedSigns.Splitter;

describe("FieldConverter", () => {
  function testZip(input: any, zipped: string, converter: ZipFieldConvertor) {
    const handler = new ComplexHandler({ fields: converter });
    const zipResult = handler.zip(input);
    expect(zipResult).toEqual(zipped);
    expect(handler.unzip(zipped)).toEqual(input);
  }

  function testCycle(source: any, converter: ZipFieldConvertor) {
    const handler = new ComplexHandler({ fields: converter });
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
        id: 1,
        name: 2,
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
        name: 1,
        child: [
          2,
          {
            id: 1,
            name: 2,
          },
        ],
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
        id: 1,
        name: 2,
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
        id: 1,
        child: [
          2,
          {
            id: 1,
            name: 2,
          },
        ],
      });
    });
  });
});
