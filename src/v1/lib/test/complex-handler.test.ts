import { ComplexHandler } from "../complex-handler";
import { SimpleHandler } from "../simple-handler";
import { TypeUtil } from "../type";
import { UsedSigns } from "../used-signs";

describe("ComplexHandler", () => {
  const handler = new ComplexHandler();
  const simpleHandler = new SimpleHandler();

  function testZip(input: any, zipped: string) {
    expect(handler.zip(input)).toBe(zipped);
    expect(handler.unzip(zipped)).toBe(input);
  }

  describe("simple", () => {
    it("number", () => {
      const value = 12345;
      testZip(value, ComplexHandler.Version + UsedSigns.Splitter.NumberProperty + simpleHandler.zip("number", value)?.value);
    });
    it("string", () => {
      const value = "Hello Word!";
      const zipped = handler.zip(value);
      expect(zipped).toBe(ComplexHandler.Version + UsedSigns.Splitter.StringProperty + simpleHandler.zip("string", value)?.value);
    });
    it("boolean", () => {
      const zipped = handler.zip(true);
      expect(zipped).toBe(ComplexHandler.Version + UsedSigns.Splitter.BooleanProperty + simpleHandler.zip("boolean", true)?.value);
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

  describe("array", () => {
    it("number", () => {
      const array: number[] = [2, 16, 128];
      const zipped = handler.zip(array);
      let actual = "" + ComplexHandler.Version;
      for (const item of array) {
        const r = simpleHandler.zip("number", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(UsedSigns.Splitter.NumberProperty);
        }
      }
      expect(zipped).toBe(actual);
    });

    it("string", () => {
      const array: string[] = ["first", "second", "third"];
      const zipped = handler.zip(array);
      let actual = "" + ComplexHandler.Version;
      for (const item of array) {
        const r = simpleHandler.zip("string", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(UsedSigns.Splitter.StringProperty);
        }
      }
      expect(zipped).toBe(actual);
    });

    it("boolean", () => {
      const array: boolean[] = [true, false, true];
      const zipped = handler.zip(array);
      let actual = "" + ComplexHandler.Version;
      for (const item of array) {
        const r = simpleHandler.zip("boolean", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(UsedSigns.Splitter.BooleanProperty);
        }
      }
      expect(zipped).toBe(actual);
    });

    it("simple mix", () => {
      const array: (boolean | number | string)[] = [true, 64, "third"];
      const zipped = handler.zip(array);
      let actual = "" + ComplexHandler.Version;
      for (const item of array) {
        const type = TypeUtil.getType(item);
        const r = simpleHandler.zip(type, item);
        if (r) {
          actual += r.splitter + r.value;
        }
      }
      expect(zipped).toBe(actual);
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
