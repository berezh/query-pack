import { Number32 } from "../../lib/number32";
import { FieldConverter } from "../field-converter";

describe("FieldConverter", () => {
  function testPack(c: FieldConverter, names: string[], name: string, number: number) {
    expect(c.pack(names, name)).toEqual(Number32.toBase32(number));
  }

  function testUnpack(c: FieldConverter, packObject: object, unpackObject: object) {
    expect(c.unpack(packObject)).toEqual(unpackObject);
  }

  describe("simple", () => {
    it("root", () => {
      const c = new FieldConverter({
        id: 1,
        name: 2,
      });

      testPack(c, [], "id", 1);
      testPack(c, [], "name", 2);

      testUnpack(
        c,
        { 1: 0, 2: "alex" },
        {
          id: 0,
          name: "alex",
        }
      );
    });
    it("deep 2", () => {
      const c = new FieldConverter({
        name: 1,
        child: [
          2,
          {
            id: 1,
            name: 2,
          },
        ],
      });

      testPack(c, [], "name", 1);
      testPack(c, ["child"], "id", 1);
      testPack(c, ["child"], "name", 2);

      testUnpack(
        c,
        { 1: "anton", 2: { 1: 10, 2: "dan" } },
        {
          name: "anton",
          child: {
            id: 10,
            name: "dan",
          },
        }
      );
    });

    it("array", () => {
      const c = new FieldConverter({
        id: 1,
        name: 2,
      });

      testPack(c, [], "id", 1);
      testPack(c, [], "name", 2);

      testUnpack(
        c,
        [{ 1: 10, 2: "kent" }],
        [
          {
            id: 10,
            name: "kent",
          },
        ]
      );
    });

    it("child array", () => {
      const c = new FieldConverter({
        name: 1,
        child: [
          2,
          {
            id: 1,
            name: 2,
          },
        ],
      });

      testPack(c, [], "name", 1);
      testPack(c, ["child"], "id", 1);
      testPack(c, ["child"], "name", 2);

      testUnpack(
        c,
        { 1: "root", 2: [{ 1: 10, 2: "kent" }] },
        {
          name: "root",
          child: [
            {
              id: 10,
              name: "kent",
            },
          ],
        }
      );
    });
  });
  describe("exceptions", () => {
    it("key duplication", () => {
      expect(() => {
        new FieldConverter({
          id: 1,
          name: 1,
        });
      }).toThrowError();
    });
    it("deep key duplication", () => {
      expect(() => {
        new FieldConverter({
          name: 1,
          child: [
            2,
            {
              id: 1,
              name: 1,
            },
          ],
        });
      }).toThrowError();
    });
  });
});
