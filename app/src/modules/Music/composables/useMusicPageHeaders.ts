import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import { EMusicPageTitle } from "@/modules/Music/infrastructure/MusicPageTitle.enum";

export default (type: EMusicPageHeaderType) => {
  const getTitle = (): EMusicPageTitle => {
    const config: { [key in EMusicPageHeaderType]: EMusicPageTitle } = {
      [EMusicPageHeaderType.PLAYLIST_SET]: EMusicPageTitle.PLAYLIST_SET,
      [EMusicPageHeaderType.ARTISTS]: EMusicPageTitle.ARTISTS,
      [EMusicPageHeaderType.NEW_ALBUMS]: EMusicPageTitle.NEW_ALBUMS,
      [EMusicPageHeaderType.POPULAR_ALBUMS]: EMusicPageTitle.POPULAR_ALBUMS,
      [EMusicPageHeaderType.CATEGORY]: EMusicPageTitle.CATEGORY,
      [EMusicPageHeaderType.PLAYLIST]: EMusicPageTitle.PLAYLIST,
    };
    return config[type];
  };

  const getImage = (): string => {
    return `/images/music/headers/${type}.png`;
  };

  return {
    getTitle,
    getImage,
  };
};
