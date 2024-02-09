export abstract class BasicOptimizer {
  public abstract pack(input: string): string;

  public abstract unpack(input: string): string;
}
