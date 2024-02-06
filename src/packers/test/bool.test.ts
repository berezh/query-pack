import { BooleanPacker } from "../boolean";

describe("BooleanPacker", () => {
  const packer = new BooleanPacker();
  it("pack", () => {
    expect(packer.pack(true)).toBe("1");
    expect(packer.pack(false)).toBe("0");
  });

  it("unpack", () => {
    expect(packer.unpack("1")).toBe(true);
    expect(packer.unpack("0")).toBe(false);
  });
});
