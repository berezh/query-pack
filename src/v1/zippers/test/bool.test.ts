import { BooleanZipper } from "../boolean";

describe("BoolZipper", () => {
  const zipper = new BooleanZipper();
  it("zip", () => {
    expect(zipper.zip(true)).toBe("1");
    expect(zipper.zip(false)).toBe("0");
  });

  it("unzip", () => {
    expect(zipper.unzip("1")).toBe(true);
    expect(zipper.unzip("0")).toBe(false);
  });
});
