import { ComplexHandler } from "../complex-handler";
import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../used-signs";
import { TU } from "./tu";

const s = UsedSigns.Splitter;

describe("ComplexHandler", () => {
  const handler = new ComplexHandler();

  const testZip = TU.converter(handler);
  const simpleHandler = new SimpleHandler();

  describe("simple", () => {
    it("number", () => {
      const value = 12345;
      testZip(value, [ComplexHandler.Version, s.NumberProperty, TU.zipN(value)]);
    });
    it("string", () => {
      const value = "Hello Word!";
      testZip(value, ComplexHandler.Version + s.StringProperty + TU.zipS(value));
    });
    it("boolean", () => {
      const value = true;
      testZip(value, ComplexHandler.Version + s.BooleanProperty + TU.zipB(value));
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
      const actual = TU.full(TU.a(value));
      testZip(value, actual);
    });

    it("boolean", () => {
      const value: boolean[] = [true, false, true];
      const actual = TU.full(TU.a(value));
      testZip(value, actual);
    });

    it("simple mix", () => {
      const value: (boolean | number | string)[] = [true, 64, "third"];
      const actual = TU.full(TU.a(value));
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
      testZip(value, TU.full(s.Object, TU.p("id", value.id), TU.p("name", value.name), TU.p("verified", value.verified)));
    });

    it("string name", () => {
      const value = {
        Name: "daniel",
        child: {
          firstName: "Alex",
        },
      };
      testZip(value, TU.full(s.Object, TU.obj(TU.p("Name", value.Name), TU.p("child", value.child)), TU.obj(TU.p("firstName", value.child.firstName))));
    });
  });

  describe("custom", () => {
    it("property name: uppercase", () => {
      const obj = {
        NamE: "daniel",
      };
      const zipped = handler.zip(obj);
      expect(zipped).toBe(ComplexHandler.Version + s.Object + TU.zipS("NamE") + s.StringProperty + obj.NamE);
    });
  });
});
