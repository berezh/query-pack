import { ComplexHandler } from "../../handlers/complex-handler";
import { SimpleHandler } from "../simple-handler";
import { TU } from "../../lib/test/tu";
import { UsedSigns } from "../../lib/used-signs";

const s = UsedSigns.Splitter;

describe("ComplexHandler", () => {
  const handler = new ComplexHandler();

  const testPack = TU.converter(handler);
  const simpleHandler = new SimpleHandler();

  describe("simple", () => {
    it("number", () => {
      const value = 12345;
      testPack(value, [ComplexHandler.Version, s.NumberProperty, TU.packN(value)]);
    });
    it("string", () => {
      const value = "Hello Word!";
      testPack(value, ComplexHandler.Version + s.StringProperty + TU.packS(value));
    });
    it("boolean", () => {
      const value = true;
      testPack(value, ComplexHandler.Version + s.BooleanProperty + TU.packB(value));
    });
  });

  describe("array", () => {
    it("number", () => {
      const value: number[] = [2, 16, 128];
      let actual = "" + ComplexHandler.Version;
      for (const item of value) {
        const r = simpleHandler.pack("number", item);
        if (r) {
          actual += r.splitter + r.value;
          expect(r.splitter).toBe(s.NumberProperty);
        }
      }
      testPack(value, actual);
    });

    it("string", () => {
      const value: string[] = ["first", "second", "third"];
      const actual = TU.full(TU.a(value));
      testPack(value, actual);
    });

    it("boolean", () => {
      const value: boolean[] = [true, false, true];
      const actual = TU.full(TU.a(value));
      testPack(value, actual);
    });

    it("simple mix", () => {
      const value: (boolean | number | string)[] = [true, 64, "third"];
      const actual = TU.full(TU.a(value));
      testPack(value, actual);
    });
  });

  describe("object", () => {
    it("default", () => {
      const value = {
        id: 10,
        name: "daniel",
        verified: true,
      };
      testPack(value, TU.full(s.Object, TU.p("id", value.id), TU.p("name", value.name), TU.p("verified", value.verified)));
    });

    it("string name", () => {
      const value = {
        Name: "daniel",
        child: {
          firstName: "Alex",
        },
      };
      testPack(value, TU.full(s.Object, TU.obj(TU.p("Name", value.Name), TU.p("child", value.child)), TU.obj(TU.p("firstName", value.child.firstName))));
    });
  });

  describe("custom", () => {
    it("property name: uppercase", () => {
      const obj = {
        NamE: "daniel",
      };
      const packed = handler.pack(obj);
      expect(packed).toBe(ComplexHandler.Version + s.Object + TU.packS("NamE") + s.StringProperty + obj.NamE);
    });
  });
});
