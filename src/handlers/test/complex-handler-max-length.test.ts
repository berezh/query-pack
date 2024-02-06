import { encode } from "../..";
import { QpError } from "../../lib/error";
import { QpErrorCode } from "../../lib/error/code";
import { ComplexHandler } from "../complex-handler";

describe("ComplexHandler MaxLength", () => {
  // 1XidN1YnameSUjohn (17)
  const team = { id: 1, name: "John" };
  describe("maxLength", () => {
    it("simple", () => {
      const maxLength = 10;
      const handler = new ComplexHandler({ maxLength });

      try {
        handler.pack(team);
      } catch (error) {
        expect((error as QpError).code).toBe(QpErrorCode.MAX_LENGTH);
      }
    });

    it("ignoreMaxLength", () => {
      const maxLength = 10;
      const handler = new ComplexHandler({ maxLength, ignoreMaxLength: true });
      expect(handler.pack(team)).toBeTruthy();
    });

    it("encode", () => {
      const maxLength = 10;

      try {
        encode(team, { maxLength });
      } catch (error) {
        expect((error as QpError).code).toBe(QpErrorCode.MAX_LENGTH);
      }
    });

    it("domainOriginLength", () => {
      const maxLength = 20;

      let handler = new ComplexHandler({ maxLength });
      const packed = handler.pack(team);
      expect(packed.length).toBe(17);

      handler = new ComplexHandler({ maxLength, domainOriginLength: 10 });

      try {
        handler.pack(team);
      } catch (error) {
        expect((error as QpError).code).toBe(QpErrorCode.MAX_LENGTH);
      }
    });
  });
});
