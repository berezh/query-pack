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
      testZip(value, TU.full(TU.obj(s.ObjectProperty, s.ObjectProperty), TU.obj(TU.p("id", value[0].id)), TU.obj(TU.p("id", value[1].id))));
    });
  });

  describe("object with array", () => {
    it("empty", () => {
      const value = {
        id: 1,
        players: [],
      };
      testZip(value, TU.full(TU.obj(TU.p("id", 1), TU.p("players", [])), TU.a([])));
    });
    it("default", () => {
      const value = {
        id: 1,
        players: ["first", "second"],
      };
      testZip(value, TU.full(TU.obj(TU.p("id", 1), TU.p("players", [])), TU.a(["first", "second"])));
    });
  });

  describe("object with array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: ["first", "second"],
      };
      testZip(value, TU.full(TU.obj(TU.p("id", 1), TU.p("players", [])), TU.a(["first", "second"])));
    });
  });

  describe("object with deep array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: [{ id: 2 }, ["first", "second"]],
      };
      const zipped = TU.full(TU.obj(TU.p("id", 1), TU.p("players", value.players)), TU.obj(s.ObjectProperty, s.ArrayProperty), TU.obj(TU.p("id", 2)), TU.a(["first", "second"]));
      testZip(value, zipped);
    });
  });
});
