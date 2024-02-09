import { ArrayNumberValueOptimizer } from "../array-number-value";

describe("ArrayNumberValueOptimizer", () => {
  function testPack(input: string, output: string) {
    const o = new ArrayNumberValueOptimizer();
    const opt = o.pack(input);
    expect(opt).toEqual(output);
    const unopt = o.unpack(output);
    expect(unopt).toEqual(input);
  }

  it("no action", () => {
    testPack("N1", "N1");
    testPack("N1N2", "N1N2");
  });

  it("value 1", () => {
    testPack("N1N2N3", "NN123");
    testPack("N1N2N3N4", "NN1234");
    testPack("N1N2N3N4N5", "NN12345");
  });

  it("value 2", () => {
    testPack("N12N34N56", "NNN123456");
    testPack("N123N456N789", "NNNN123456789");
    testPack("N1234N5678N9abc", "NNNNN123456789abc");
  });

  it("value 3", () => {
    testPack("N123N456N789", "NNNN123456789");
    testPack("N123N456N789Nabc", "NNNN123456789abc");
    testPack("N123N456N789NabcNdef", "NNNN123456789abcdef");
  });

  it("value 4", () => {
    testPack("N1234N5678N9abc", "NNNNN123456789abc");
    testPack("N1234N5678N9abcNdefg", "NNNNN123456789abcdefg");
  });
});
