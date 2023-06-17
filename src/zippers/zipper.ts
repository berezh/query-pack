export abstract class Zipper<T = unknown> {
  public abstract zip(source: T): string;

  public abstract unzip(zipped: string): T;
}
