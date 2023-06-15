import { NameConverter } from "../name-converter";
import { Number32 } from "../number32";

describe("NameConverter", () => {
  function testZip(c: NameConverter, names: string[], name: string, number: number) {
    expect(c.zipName(names, name)).toEqual(Number32.toBase32(number));
  }

  function testUnzip(c: NameConverter, zipObject: object, unzipObject: object) {
    expect(c.unzipNames(zipObject)).toEqual(unzipObject);
  }

  describe("simple", () => {
    it("root", () => {
      const c = new NameConverter({
        id: 1,
        name: 2,
      });

      testZip(c, [], "id", 1);
      testZip(c, [], "name", 2);

      testUnzip(
        c,
        { 1: 0, 2: "alex" },
        {
          id: 0,
          name: "alex",
        }
      );
    });
    it("deep 2", () => {
      const c = new NameConverter({
        name: 1,
        child: [
          2,
          {
            id: 1,
            name: 2,
          },
        ],
      });

      testZip(c, [], "name", 1);
      testZip(c, ["child"], "id", 1);
      testZip(c, ["child"], "name", 2);

      testUnzip(
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
      const c = new NameConverter({
        id: 1,
        name: 2,
      });

      testZip(c, [], "id", 1);
      testZip(c, [], "name", 2);

      testUnzip(
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
      const c = new NameConverter({
        name: 1,
        child: [
          2,
          {
            id: 1,
            name: 2,
          },
        ],
      });

      testZip(c, [], "name", 1);
      testZip(c, ["child"], "id", 1);
      testZip(c, ["child"], "name", 2);

      testUnzip(
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
        new NameConverter({
          id: 1,
          name: 1,
        });
      }).toThrowError();
    });
    it("deep key duplication", () => {
      expect(() => {
        new NameConverter({
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
