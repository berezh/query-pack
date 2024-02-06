import { ValueConverter } from "../value-converter";

describe("ValueConverter", () => {
  function testPack(c: ValueConverter, roots: string[], name: string, value: string | number, packedValue: string) {
    expect(c.pack(roots, name, `${value}`)).toEqual(packedValue);
  }

  function testUnpack(c: ValueConverter, roots: string[], name: string, value: string | number, packedValue: string | number) {
    expect(c.unpackValue(roots, name, value)).toEqual(packedValue);
  }

  describe("simple", () => {
    it("root", () => {
      const c = new ValueConverter({
        name: {
          literal1: 1,
          literal2: 2,
        },
      });

      testPack(c, [], "name", "literal1", "1");
      testPack(c, [], "name", "literal2", "2");

      testUnpack(c, [], "name", 1, "literal1");
      testUnpack(c, [], "name", 2, "literal2");
    });

    it("deep 2", () => {
      const c = new ValueConverter({
        child: {
          literal1: 1,
          literal2: 2,
        },
      });
      testPack(c, ["child"], "name", "literal1", "1");
      testPack(c, ["child"], "name", "literal2", "2");

      testUnpack(c, ["child"], "name", 1, "literal1");
      testUnpack(c, ["child"], "name", 2, "literal2");
    });
  });

  describe("exceptions", () => {
    it("value duplication", () => {
      expect(() => {
        new ValueConverter({
          literal1: 1,
          literal2: 1,
        });
      }).toThrowError();
    });
    it("deep value duplication", () => {
      expect(() => {
        new ValueConverter({
          name: 1,
          child: {
            id: 1,
            name: 1,
          },
        });
      }).toThrowError();
    });
    // TODO: keys duplication
  });
});
