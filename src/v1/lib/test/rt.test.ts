import { RT } from "../rt";

describe("RT", () => {
  describe("itemAllReg", () => {
    it("default", () => {
      expect("N2NgN40".match(RT.itemAllReg)).toBeTruthy();
    });
  });
  describe("itemSplitReg", () => {
    it("default", () => {
      expect("N2NgO".match(RT.itemSplitReg)).toEqual(["N2", "Ng", "O"]);
    });
    it("default", () => {
      expect("N2NgA".match(RT.itemSplitReg)).toEqual(["N2", "Ng", "A"]);
    });
  });

  describe("itemPartsSplitReg", () => {
    it("default", () => {
      expect("N2".match(RT.itemPartsSplitReg)).toEqual(["N", "2"]);
      expect("Ng".match(RT.itemPartsSplitReg)).toEqual(["N", "g"]);
      expect("O".match(RT.itemPartsSplitReg)).toEqual(["O"]);
    });
  });

  describe("propertyAllReg", () => {
    it("default", () => {
      const zipped = "idNaYnameSdanielYverifiedB1";
      const matches = zipped.match(RT.propertyAllReg);
      expect(matches).toEqual([zipped]);
    });
    it("ref", () => {
      //const refText = RT.propertyAllReg.toString();
      const zipped = "childOidNaYnameSdanielYverifiedB1";
      const matches = zipped.match(RT.propertyAllReg);
      expect(matches).toEqual([zipped]);
    });
    // idNb
    it("one prop", () => {
      const zipped = "idNb";
      const matches = zipped.match(RT.propertyAllReg);
      expect(matches).toEqual([zipped]);
    });
  });

  // propertyPartsSplitReg
  describe("propertyPartsSplitReg", () => {
    it("default", () => {
      expect("idNa".match(RT.propertyPartsSplitReg)).toEqual(["id", "N", "a"]);
      expect("nameSdaniel".match(RT.propertyPartsSplitReg)).toEqual(["name", "S", "daniel"]);
      expect("verifiedB1".match(RT.propertyPartsSplitReg)).toEqual(["verified", "B", "1"]);
      expect("childA".match(RT.propertyPartsSplitReg)).toEqual(["child", "A"]);
    });
  });
});
