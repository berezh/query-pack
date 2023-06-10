import { ComplexHandler } from "../complex-handler";
import { SimpleHandler } from "../simple-handler";
import { TypeUtil } from "../type";
import { UsedSigns } from "../used-signs";
import { TU } from "./tu";

const s = UsedSigns.Splitter;

describe("ComplexHandler", () => {
  const handler = new ComplexHandler();
  const simpleHandler = new SimpleHandler();

  const testZip = TU.converter(handler);

  describe("simple", () => {
    it("number", () => {
      const value = 12345;
      testZip(value, ComplexHandler.Version + s.NumberProperty + simpleHandler.zip("number", value)?.value);
    });
    it("string", () => {
      const value = "Hello Word!";
      testZip(value, ComplexHandler.Version + s.StringProperty + simpleHandler.zip("string", value)?.value);
    });
    it("boolean", () => {
      const value = true;
      testZip(value, ComplexHandler.Version + s.BooleanProperty + simpleHandler.zip("boolean", value)?.value);
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
          expect(r.splitter).toBe(s.NumberProperty);
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
          expect(r.splitter).toBe(s.StringProperty);
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
          expect(r.splitter).toBe(s.BooleanProperty);
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
      const value = {
        id: 10,
        name: "daniel",
        verified: true,
      };
      testZip(
        value,
        ComplexHandler.Version +
          s.Object +
          "id" +
          s.NumberProperty +
          simpleHandler.zip("number", value.id)?.value +
          s.Property +
          "name" +
          s.StringProperty +
          value.name +
          s.Property +
          "verified" +
          s.BooleanProperty +
          simpleHandler.zip("boolean", value.verified)?.value
      );
    });
  });

  describe("custom", () => {
    it("property name: uppercase", () => {
      const obj = {
        NamE: "daniel",
      };
      const zipped = handler.zip(obj);
      expect(zipped).toBe(ComplexHandler.Version + s.Object + simpleHandler.zip("string", "NamE")?.value + s.StringProperty + obj.NamE);
    });
  });
});
