import { ZipOptions } from "../../interfaces";
import { ComplexHandler } from "../complex-handler";
import { TU } from "./tu";

describe("ComplexHandler Converter", () => {
  function testZip(input: any, zipped: string, options: ZipOptions) {
    const handler = new ComplexHandler(options);
    const zipResult = handler.zip(input);
    expect(zipResult).toEqual(zipped);
    expect(handler.unzip(zipped)).toEqual(input);
  }

  describe("simple", () => {
    it("empty", () => {
      const value = {
        id: 10,
        name: "Kent",
      };
      testZip(value, TU.full(TU.obj(TU.p("1", value.id), TU.p("2", value.name))), {
        convertor: {
          id: 1,
          name: 2,
        },
      });
    });
  });
});
