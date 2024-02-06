import { PackValueConvertor } from "../../interfaces";
import { ComplexHandler } from "../../handlers/complex-handler";

describe("ValueConverter", () => {
  function testPack(source: any, alt: any, converter: PackValueConvertor) {
    const handler = new ComplexHandler({ values: converter });
    const packSource = handler.pack(source);
    const packAlt = new ComplexHandler().pack(alt);
    expect(packSource).toEqual(packAlt);

    const unpackResult = handler.unpack(packSource);
    expect(source).toEqual(unpackResult);
  }

  describe("object", () => {
    it("simple: string key", () => {
      testPack(
        {
          name: "Kent",
        },
        {
          name: "k",
        },
        {
          name: {
            Kent: "k",
          },
        }
      );
    });

    it("example", () => {
      testPack(
        {
          name: "zak",
          level: "good",
        },
        {
          name: "zak",
          level: "4",
        },
        {
          level: {
            unknown: 1,
            notbad: 2,
            normal: 3,
            good: 4,
            star: 5,
          },
        }
      );
    });
    it("simple: number key", () => {
      testPack(
        {
          name: "Kent",
        },
        {
          name: "1",
        },
        {
          name: {
            Kent: 1,
          },
        }
      );
    });
    it("child", () => {
      testPack(
        {
          name: "root",
          child: {
            name: "Den",
          },
        },
        {
          name: "r",
          child: {
            name: "d",
          },
        },
        {
          name: {
            root: "r",
          },
          child: {
            name: {
              Den: "d",
            },
          },
        }
      );
    });
    it("many child", () => {
      testPack(
        {
          child1: {
            name: "Kent",
          },
          child2: {
            name: "Dana",
            child3: {
              name: "Pepe",
            },
          },
        },
        {
          child1: {
            name: "k",
          },
          child2: {
            name: "d",
            child3: {
              name: "p",
            },
          },
        },
        {
          child1: {
            name: { Kent: "k" },
          },
          child2: {
            name: { Dana: "d" },
            child3: {
              name: { Pepe: "p" },
            },
          },
        }
      );
    });
  });

  describe("array", () => {
    it("root", () => {
      testPack(
        [
          {
            name: "Kent",
          },
          {
            name: "Dent",
          },
        ],
        [
          {
            name: "k",
          },
          {
            name: "d",
          },
        ],
        {
          name: {
            Kent: "k",
            Dent: "d",
          },
        }
      );
    });
    // 1 X 1N9 Y 2A X O X 1Na Y nameSUkent
    it("child", () => {
      testPack(
        {
          child: [
            {
              name: "Kent",
            },
            {
              name: "Dent",
            },
          ],
        },
        {
          child: [
            {
              name: "k",
            },
            {
              name: "d",
            },
          ],
        },
        {
          name: {
            Kent: "k",
            Dent: "d",
          },
        }
      );
    });
  });
});
