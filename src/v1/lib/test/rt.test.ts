import { RT } from "../rt";

describe("RT", () => {
  describe("itemAllReg", () => {
    it("default", () => {
      expect("N2NgN40".match(RT.itemAllReg)).toBeTruthy();
    });
  });
  describe("itemSplitReg", () => {
    it("default", () => {
      expect("N2NgR".match(RT.itemSplitReg)).toEqual(["N2", "Ng", "R"]);
    });
  });

  describe("itemPartsSplitReg", () => {
    it("default", () => {
      expect("N2".match(RT.itemPartsSplitReg)).toEqual(["N", "2"]);
      expect("Ng".match(RT.itemPartsSplitReg)).toEqual(["N", "g"]);
      expect("R".match(RT.itemPartsSplitReg)).toEqual(["R"]);
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
      const zipped = "childRidNaYnameSdanielYverifiedB1";
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
      expect("childR".match(RT.propertyPartsSplitReg)).toEqual(["child", "R"]);
    });
  });
});
