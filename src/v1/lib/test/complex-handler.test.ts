import { ComplexHandler } from "../complex-handler";
import { SimpleHandler } from "../simple-handler";
import { UsedSigns } from "../used-signs";

describe("ComplexHandler", () => {
  const handler = new ComplexHandler();
  const simpleHandler = new SimpleHandler();
  describe("object", () => {
    it("simple", () => {
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
    it("simple", () => {
      const numberArray: number[] = [123, 456, 789];
      const zipped = handler.zip(numberArray);
      expect(zipped).toBe(
        ComplexHandler.Version +
          UsedSigns.Splitter.Object +
          UsedSigns.Splitter.NumberProperty +
          simpleHandler.zip("number", numberArray[0])?.value +
          UsedSigns.Splitter.Property +
          UsedSigns.Splitter.NumberProperty +
          simpleHandler.zip("number", numberArray[1])?.value +
          UsedSigns.Splitter.Property +
          UsedSigns.Splitter.NumberProperty +
          simpleHandler.zip("number", numberArray[2])?.value
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
});
