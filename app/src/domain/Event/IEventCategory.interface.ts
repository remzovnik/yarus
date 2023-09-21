export interface IEventCategory {
  id: number;
  name: string;
  aliases: string[];
  image: {
    sourceUrl: string;
    mobile: { url: string; width: number; height: number };
    original: { url: string; width: number; height: number };
  };
}
