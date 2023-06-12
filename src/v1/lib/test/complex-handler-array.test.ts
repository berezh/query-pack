import { ComplexHandler } from "../complex-handler";
import { UsedSigns } from "../used-signs";
import { TU } from "./tu";

const s = UsedSigns.Splitter;

interface TestObject {
  id: number;
}

describe("ComplexHandler Array", () => {
  const handler = new ComplexHandler();

  const testZip = TU.converter(handler);

  describe("array of objects", () => {
    it("default", () => {
      const value: TestObject[] = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];
      testZip(value, TU.full(TU.obj(s.ReferenceProperty, s.ReferenceProperty), TU.obj(TU.p("id", value[0].id)), TU.obj(TU.p("id", value[1].id))));
    });
  });

  describe("object with array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: ["first", "second"],
      };
      testZip(value, TU.full(TU.obj(TU.p("id", 1), TU.r("players")), TU.a(["first", "second"])), {
        zip: true,
      });
    });
  });

  describe("object with array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: ["first", "second"],
      };
      testZip(value, TU.full(TU.obj(TU.p("id", 1), TU.r("players")), TU.a(["first", "second"])), {
        zip: true,
      });
    });
  });

  describe("object with deep array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: [{ id: 2 }, ["first", "second"]],
      };
      testZip(value, TU.full(TU.obj(TU.p("id", 1), TU.r("players")), TU.obj(s.ReferenceProperty, s.ReferenceProperty), TU.obj(TU.p("id", 2)), TU.a(["first", "second"])), {
        zip: true,
      });
    });
  });
});
