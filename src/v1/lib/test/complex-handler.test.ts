import { ComplexHandler } from "../complex-handler";
import { SimpleHandler } from "../simple-handler";
import { TypeUtil } from "../type";
import { UsedSigns } from "../used-signs";

describe("ComplexHandler", () => {
  const handler = new ComplexHandler();
  const simpleHandler = new SimpleHandler();

  function testZip(input: any, zipped: string) {
    expect(handler.zip(input)).toEqual(zipped);
    expect(handler.unzip(zipped)).toEqual(input);
  }

  describe("simple", () => {
    it("number", () => {
      const value = 12345;
      testZip(value, ComplexHandler.Version + UsedSigns.Splitter.NumberProperty + simpleHandler.zip("number", value)?.value);
    });
    it("string", () => {
      const value = "Hello Word!";
      testZip(value, ComplexHandler.Version + UsedSigns.Splitter.StringProperty + simpleHandler.zip("string", value)?.value);
    });
    it("boolean", () => {
      const value = true;
      testZip(value, ComplexHandler.Version + UsedSigns.Splitter.BooleanProperty + simpleHandler.zip("boolean", value)?.value);
    });
  });

  describe("array", () => {
    it("number", () => {
      const value: number[] = [2, 16, 128];
      let actual = "" + ComplexHandler.Version;
      for (const item of value) {
        const r = simpleHandler.zip("number", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(UsedSigns.Splitter.NumberProperty);
        }
      }
      testZip(value, actual);
    });

    it("string", () => {
      const value: string[] = ["first", "second", "third"];
      let actual = "" + ComplexHandler.Version;
      for (const item of value) {
        const r = simpleHandler.zip("string", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(UsedSigns.Splitter.StringProperty);
        }
      }
      testZip(value, actual);
    });

    it("boolean", () => {
      const value: boolean[] = [true, false, true];
      let actual = "" + ComplexHandler.Version;
      for (const item of value) {
        const r = simpleHandler.zip("boolean", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(UsedSigns.Splitter.BooleanProperty);
        }
      }
      testZip(value, actual);
    });

    it("simple mix", () => {
      const value: (boolean | number | string)[] = [true, 64, "third"];
      let actual = "" + ComplexHandler.Version;
      for (const item of value) {
        const type = TypeUtil.getType(item);
        const r = simpleHandler.zip(type, item);
        if (r) {
          actual += r.splitter + r.value;
        }
      }
      testZip(value, actual);
    });
  });

  describe("object", () => {
    it("default", () => {
      const obj = {
        id: 10,
        name: "daniel",
        verified: true,
      };
      const zipped = handler.zip(obj);
      expect(zipped).toBe(
        ComplexHandler.Version +
          UsedSigns.Splitter.Object +
          "id" +
          UsedSigns.Splitter.NumberProperty +
          simpleHandler.zip("number", obj.id)?.value +
          UsedSigns.Splitter.Property +
          "name" +
          UsedSigns.Splitter.StringProperty +
          obj.name +
          UsedSigns.Splitter.Property +
          "verified" +
          UsedSigns.Splitter.BooleanProperty +
          simpleHandler.zip("boolean", obj.verified)?.value
      );
    });

    it("property name: uppercase", () => {
      const obj = {
        NamE: "daniel",
      };
      const zipped = handler.zip(obj);
      expect(zipped).toBe(ComplexHandler.Version + UsedSigns.Splitter.Object + simpleHandler.zip("string", "NamE")?.value + UsedSigns.Splitter.StringProperty + obj.NamE);
    });
  });

  describe("custom", () => {
    it("property name: uppercase", () => {
      const obj = {
        NamE: "daniel",
      };
      const zipped = handler.zip(obj);
      expect(zipped).toBe(ComplexHandler.Version + UsedSigns.Splitter.Object + simpleHandler.zip("string", "NamE")?.value + UsedSigns.Splitter.StringProperty + obj.NamE);
    });
  });
});
