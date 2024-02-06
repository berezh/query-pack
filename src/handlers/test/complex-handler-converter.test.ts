import { PackOptions } from "../../interfaces";
import { ComplexHandler } from "../../handlers/complex-handler";

describe("Combine Converters", () => {
  function testPack(source: any, alt: any, options: PackOptions) {
    const handler = new ComplexHandler(options);
    const packSource = handler.pack(source);
    const packAlt = new ComplexHandler().pack(alt);
    expect(packSource).toEqual(packAlt);

    const unpackResult = handler.unpack(packSource);
    expect(source).toEqual(unpackResult);
  }

  describe("object", () => {
    it("root", () => {
      testPack(
        {
          name: "Kent",
        },
        {
          1: "k",
        },
        {
          fields: {
            name: 1,
          },
          values: {
            name: {
              Kent: "k",
            },
          },
        }
      );
    });
    // it("child", () => {
    //   testZip(
    //     {
    //       name: "root",
    //       child: {
    //         name: "Den",
    //       },
    //     },
    //     {
    //       name: "r",
    //       child: {
    //         name: "d",
    //       },
    //     },
    //     {
    //       name: {
    //         root: "r",
    //       },
    //       child: {
    //         name: {
    //           Den: "d",
    //         },
    //       },
    //     }
    //   );
    // });
    // it("many child", () => {
    //   testZip(
    //     {
    //       child1: {
    //         name: "Kent",
    //       },
    //       child2: {
    //         name: "Dana",
    //         child3: {
    //           name: "Pepe",
    //         },
    //       },
    //     },
    //     {
    //       child1: {
    //         name: "k",
    //       },
    //       child2: {
    //         name: "d",
    //         child3: {
    //           name: "p",
    //         },
    //       },
    //     },
    //     {
    //       child1: {
    //         name: { Kent: "k" },
    //       },
    //       child2: {
    //         name: { Dana: "d" },
    //         child3: {
    //           name: { Pepe: "p" },
    //         },
    //       },
    //     }
    //   );
    // });
  });

  // describe("array", () => {
  //   it("root", () => {
  //     testZip(
  //       [
  //         {
  //           name: "Kent",
  //         },
  //         {
  //           name: "Dent",
  //         },
  //       ],
  //       [
  //         {
  //           name: "k",
  //         },
  //         {
  //           name: "d",
  //         },
  //       ],
  //       {
  //         name: {
  //           Kent: "k",
  //           Dent: "d",
  //         },
  //       }
  //     );
  //   });
  //   // 1 X 1N9 Y 2A X O X 1Na Y nameSUkent
  //   it("child", () => {
  //     testZip(
  //       {
  //         child: [
  //           {
  //             name: "Kent",
  //           },
  //           {
  //             name: "Dent",
  //           },
  //         ],
  //       },
  //       {
  //         child: [
  //           {
  //             name: "k",
  //           },
  //           {
  //             name: "d",
  //           },
  //         ],
  //       },
  //       {
  //         name: {
  //           Kent: "k",
  //           Dent: "d",
  //         },
  //       }
  //     );
  //   });
  // });
});
