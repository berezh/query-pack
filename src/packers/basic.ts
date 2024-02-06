export abstract class BasicPacker<T = unknown> {
  public abstract pack(source: T): string;

  public abstract unpack(packed: string): T;
}
