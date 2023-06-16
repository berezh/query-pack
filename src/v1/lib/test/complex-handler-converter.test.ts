import { ZipOptions } from "../../interfaces";
import { ComplexHandler } from "../complex-handler";

describe("Combine Converters", () => {
  function testZip(source: any, alt: any, options: ZipOptions) {
    const handler = new ComplexHandler(options);
    const zipSource = handler.zip(source);
    const zipAlt = new ComplexHandler().zip(alt);
    expect(zipSource).toEqual(zipAlt);

    const unzipResult = handler.unzip(zipSource);
    expect(source).toEqual(unzipResult);
  }

  describe("object", () => {
    it("root", () => {
      testZip(
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
