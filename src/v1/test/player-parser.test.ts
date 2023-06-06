import { PlayerParserV1 } from "../utils/player-parser";

describe("PlayerParser", () => {
  describe("parsePlayer", () => {
    it("start", () => {
      expect(PlayerParserV1.parsePlayer("abc")).toBe("abc");
      expect(PlayerParserV1.parsePlayer(" abc")).toBe("abc");
      expect(PlayerParserV1.parsePlayer("1 abc")).toBe("abc");
      expect(PlayerParserV1.parsePlayer("1. abc")).toBe("abc");
    });
    it("special chars in name", () => {
      expect(PlayerParserV1.parsePlayer("nick-novel")).toBe("nick-novel");
      expect(PlayerParserV1.parsePlayer("nick'novel")).toBe("nick'novel");
    });
    it("inside", () => {
      expect(PlayerParserV1.parsePlayer("anton, ta")).toBe("anton ta");
      expect(PlayerParserV1.parsePlayer("anton; ta")).toBe("anton ta");
      expect(PlayerParserV1.parsePlayer("anton;.,ta")).toBe("anton ta");
      expect(PlayerParserV1.parsePlayer("(anton) | [ta]")).toBe("anton ta");
      expect(PlayerParserV1.parsePlayer("{anton} ta")).toBe("anton ta");
    });
    it("end", () => {
      expect(PlayerParserV1.parsePlayer("anton ")).toBe("anton");
      expect(PlayerParserV1.parsePlayer("18. Oleg K.")).toBe("oleg k");
    });

    it("case", () => {
      expect(PlayerParserV1.parsePlayer("Anton PD")).toBe("anton pd");
    });

    it("max length", () => {
      expect(PlayerParserV1.parsePlayer("vadym poberezhnyi vadym poberezhnyi")).toBe("vadym poberezhnyi va");
    });
  });

  describe("parsePlayerSet", () => {
    it("yes", () => {
      expect(PlayerParserV1.parsePlayerSet("oleg\nanton")).toEqual(["oleg", "anton"]);
      expect(PlayerParserV1.parsePlayerSet("oleg, anton")).toEqual(["oleg", "anton"]);
      expect(PlayerParserV1.parsePlayerSet("oleg; anton")).toEqual(["oleg", "anton"]);
      expect(PlayerParserV1.parsePlayerSet("oleg; anton, igore\nalan")).toEqual(["oleg", "anton", "igore", "alan"]);
    });
  });
});
