export class TextService {
  public trimHashtag = (value: string): string => {
    return this.removeMultipleSpaces(this.replaceSymbol("#", " ", value)).trim();
  };

  public replaceSymbol = (oldSymbol: string, newSymbol: string, value: string): string => {
    return value.replace(new RegExp(oldSymbol, "g"), newSymbol);
  };

  public removeMultipleSpaces = (value: string): string => {
    return value.replace(/\s\s+/g, " ");
  };
  // Производит склонение существительного в засимости от числительного
  public decline(num: number, titles: string[]): string {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]];
  }
}
