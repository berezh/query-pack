type CompareFunction<T> = [callback: (item: T) => number, direction?: "asc" | "desc"];

export class CommonUtil {
  public static order<T>(items: T[], ...compares: CompareFunction<T>[]): T[] {
    let result = items;

    for (const [compare, dir = "asc"] of compares) {
      result = result.sort((a, b) => {
        return dir === "asc" ? compare(a) - compare(b) : compare(b) - compare(a);
      });
    }

    return result;
  }
}
