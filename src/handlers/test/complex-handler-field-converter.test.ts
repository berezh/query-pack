import { PackFieldConvertor } from "../../interfaces";
import { ComplexHandler } from "../../handlers/complex-handler";
import { TU } from "../../lib/test/tu";
import { UsedSigns } from "../../lib/used-signs";

const s = UsedSigns.Splitter;

describe("FieldConverter", () => {
  function testPack(input: any, packed: string, converter: PackFieldConvertor) {
    const handler = new ComplexHandler({ fields: converter });
    const packResult = handler.pack(input);
    expect(packResult).toEqual(packed);
    expect(handler.unpack(packed)).toEqual(input);
  }

  function testCycle(source: any, converter: PackFieldConvertor) {
    const handler = new ComplexHandler({ fields: converter });
    const packed = handler.pack(source);
    const unpacked = handler.unpack(packed);
    expect(source).toEqual(unpacked);
  }

  describe("object", () => {
    it("root", () => {
      const v = {
        id: 10,
        name: "Kent",
      };
      testPack(v, TU.full(s.Object, TU.obj(TU.p("1", v.id), TU.p("2", v.name))), {
        id: 1,
        name: 2,
      });
    });
    it("example", () => {
      testPack(
        {
          id: 1,
          name: "Team 1",
          captain: "zak",
        },
        "1X1N1Y2SUteamW1Y3Szak",
        {
          id: 1,
          name: 2,
          captain: 3,
        }
      );
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
