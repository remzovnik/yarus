import { IMainFeedFilterType } from "@/domain/MainFeed/IMainFeedFilterType.interface";
import { EContentType } from "@/domain/Content/EContentType.enum";

export const MAIN_FEED_SELECT_ALL = {
  title: "Выбрать все типы",
  description: "",
  isChecked: false,
};

export const MAIN_FEED_FILTER_TYPES: IMainFeedFilterType[] = [
  {
    id: EContentType.PHOTO,
    title: "Инсталента",
    description: "Фотографии пользователей",
    isChecked: false,
  },
  {
    id: EContentType.NEWS,
    title: "Новости",
    description: "",
    isChecked: false,
  },
  {
    id: EContentType.VIDEO,
    title: "Видео",
    description: "",
    isChecked: false,
  },
  {
    id: EContentType.POST,
    title: "Публикации пользователей",
    description: "Авторские посты на любые темы",
    isChecked: false,
  },
  {
    id: EContentType.CLIP_BOX,
    title: "Сюжеты",
    description: "Короткие ролики",
    isChecked: false,
  },
];
