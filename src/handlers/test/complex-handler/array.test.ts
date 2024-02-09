import { ComplexHandler } from "../../complex-handler";
import { UsedSigns } from "../../../lib/used-signs";
import { TU } from "../../../lib/test/tu";

const s = UsedSigns.Splitter;

interface TestObject {
  id: number;
}

describe("ComplexHandler Array", () => {
  const handler = new ComplexHandler({ useOptimizer: false });

  const testPack = TU.converter(handler);

  describe("root", () => {
    it("example", () => {
      testPack([12, 34, 56], "1NcN12N1o", { pack: true });
      testPack(["cat", "dog", "mouse"], "1ScatSdogSmouse", { pack: true });
      testPack([12, "dog", true], "1NcSdogB1", { pack: true });
    });

    it("contains undefined", () => {
      const v = ["kant", undefined, 1];
      testPack(v, ComplexHandler.Version + TU.i("kant") + TU.i(undefined) + TU.i(1));
    });
    it("contains null", () => {
      const v = ["kant", null, 1];
      testPack(v, ComplexHandler.Version + TU.i("kant") + TU.i(null) + TU.i(1));
    });
  });

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
      testPack(value, TU.full(TU.obj(s.ObjectProperty, s.ObjectProperty), TU.obj(TU.p("id", value[0].id)), TU.obj(TU.p("id", value[1].id))));
    });
  });

  describe("object with array", () => {
    it("empty", () => {
      const value = {
        id: 1,
        players: [],
      };
      testPack(value, TU.full(s.Object, TU.obj(TU.p("id", 1), TU.p("players", [])), TU.a([])));
    });
    it("default", () => {
      const value = {
        id: 1,
        players: ["first", "second"],
      };
      testPack(value, TU.full(s.Object, TU.obj(TU.p("id", 1), TU.p("players", [])), TU.a(["first", "second"])));
    });
  });

  describe("object with array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: ["first", "second"],
      };
      testPack(value, TU.full(s.Object, TU.obj(TU.p("id", 1), TU.p("players", [])), TU.a(["first", "second"])));
    });
  });

  describe("object with deep array", () => {
    it("default", () => {
      const value = {
        id: 1,
        players: [{ id: 2 }, ["first", "second"]],
      };
      const packed = TU.full(
        s.Object,
        TU.obj(TU.p("id", 1), TU.p("players", value.players)),
        TU.obj(s.ObjectProperty, s.ArrayProperty),
        TU.obj(TU.p("id", 2)),
        TU.a(["first", "second"])
      );
      testPack(value, packed);
    });
  });
});
