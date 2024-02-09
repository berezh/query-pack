import { ArrayBoolValueOptimizer } from "../array-bool-value";

describe("ArrayBoolValueOptimizer", () => {
  function testPack(input: string, output: string) {
    const o = new ArrayBoolValueOptimizer();
    const opt = o.pack(input);
    expect(opt).toEqual(output);
    const unopt = o.unpack(output);
    expect(unopt).toEqual(input);
  }

  it("no action", () => {
    testPack("B1", "B1");
    testPack("B1B0", "B1B0");
  });

  it("simple", () => {
    testPack("B1B0B1", "BB101");
    testPack("B1B0B1B0", "BB1010");
    testPack("B1B0B1B0B1", "BB10101");
  });
});
