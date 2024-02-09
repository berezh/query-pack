export interface AvmsParsedString {
  splitter: string;
  valueLength: number;
  values: string[];
}

// Array value match string
export class AvmsUtil {
  public static parsePack(splitter: string, input: string): AvmsParsedString {
    const values = input.split(splitter).filter(x => x !== "");
    return {
      splitter,
      valueLength: values.length ? values[0].length : 0,
      values,
    };
  }

  public static parseUnpack(splitter: string, input: string): AvmsParsedString {
    const match = input.match(new RegExp(`^${splitter}+`));
    if (match?.length) {
      const prefix = match[0];
      const valueLength = prefix.length - 1;
      const valueString = input.slice(prefix.length);
      const values: string[] = [];
      const count = valueString.length / valueLength;
      for (let i = 0; i < count; i++) {
        const start = valueLength * i;
        values.push(valueString.slice(start, start + valueLength));
      }

      return {
        splitter,
        valueLength,
        values,
      };
    }

    return {
      splitter,
      valueLength: 0,
      values: [input],
    };
  }
}
