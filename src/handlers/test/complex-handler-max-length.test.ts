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
        handler.zip(team);
      } catch (error) {
        expect((error as QpError).code).toBe(QpErrorCode.MAX_LENGTH);
      }
    });

    it("domainOriginLength", () => {
      const maxLength = 20;

      let handler = new ComplexHandler({ maxLength });
      const zipped = handler.zip(team);
      expect(zipped.length).toBe(17);

      handler = new ComplexHandler({ maxLength, domainOriginLength: 10 });

      try {
        handler.zip(team);
      } catch (error) {
        expect((error as QpError).code).toBe(QpErrorCode.MAX_LENGTH);
      }
    });
  });
});
