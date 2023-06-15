import { ValueConverter } from "../value-converter";

describe("ValueConverter", () => {
  function testZip(c: ValueConverter, roots: string[], name: string, value: string | number, zippedValue: string | number) {
    expect(c.zip(roots, name, value)).toEqual(zippedValue);
  }

  function testUnzip(c: ValueConverter, roots: string[], name: string, value: string | number, zippedValue: string | number) {
    expect(c.unzip(roots, name, value)).toEqual(zippedValue);
  }

  describe("simple", () => {
    it("root", () => {
      const c = new ValueConverter({
        name: {
          literal1: 1,
          literal2: 2,
        },
      });

      testZip(c, [], "name", "literal1", 1);
      testZip(c, [], "name", "literal2", 2);

      testUnzip(c, [], "name", 1, "literal1");
      testUnzip(c, [], "name", 2, "literal2");
    });

    it("deep 2", () => {
      const c = new ValueConverter({
        child: {
          literal1: 1,
          literal2: 2,
        },
      });
      testZip(c, ["child"], "name", "literal1", 1);
      testZip(c, ["child"], "name", "literal2", 2);

      testUnzip(c, ["child"], "name", 1, "literal1");
      testUnzip(c, ["child"], "name", 2, "literal2");
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
