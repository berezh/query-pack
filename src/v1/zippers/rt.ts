import { Number32 } from "../lib/number32";
import { UsedSigns } from "../lib/used-signs";

const s = UsedSigns.Splitter;

const simpleSigns = [s.StringProperty, s.NumberProperty, s.BooleanProperty];

export class RT {
  private static not(...sings: string[]): string {
    return `[^${sings.join("")}]+`;
  }

  private static notCommon(...sings: string[]) {
    return RT.not(...simpleSigns, s.ReferenceProperty, ...sings);
  }

  private static any(text: string | string[]): string {
    return `[${Array.isArray(text) ? text.join("") : text}]`;
  }

  private static or(...text: string[]): string {
    return `${text.map(x => `(${x})`).join("|")}`;
  }

  private static join(...text: string[]): string {
    return text.join("");
  }

  private static g(...text: string[]): string {
    return `(${text.join("")})`;
  }

  private static oneOrMore(text: string): string {
    return `(${text})+`;
  }

  private static full(text: string): string {
    return `^${text}$`;
  }

  private static maybe(text: string): string {
    return text.length > 1 ? `[${text}]` : `${text}?`;
  }

  private static item = RT.or(RT.join(RT.any(simpleSigns), RT.notCommon()), s.ReferenceProperty);

  private static itemParts = RT.or(RT.any(simpleSigns), RT.notCommon(), s.ReferenceProperty);

  private static simpleProperty = RT.join(RT.notCommon(), RT.any(simpleSigns), RT.notCommon());

  private static referenceProperty = RT.join(RT.notCommon(), s.ReferenceProperty);

  private static propertyParts = RT.or(RT.notCommon(), RT.any(simpleSigns), s.ReferenceProperty, RT.notCommon());

  private static propertyAll = RT.full(RT.oneOrMore(RT.join(RT.g(RT.or(RT.simpleProperty, RT.referenceProperty)), RT.maybe(s.Property))));

  private static itemAll = RT.full(RT.oneOrMore(RT.item));

  private static itemSplit = RT.or(RT.item);

  // PUBLIC

  public static number32Signs = Object.keys(Number32.numbers);

  public static propertyAllReg = new RegExp(RT.propertyAll, "g");

  public static itemAllReg = new RegExp(RT.itemAll, "g");

  public static itemSplitReg = new RegExp(RT.itemSplit, "g");

  public static itemPartsSplitReg = new RegExp(RT.itemParts, "g");

  public static propertyPartsSplitReg = new RegExp(RT.propertyParts, "g");
}
