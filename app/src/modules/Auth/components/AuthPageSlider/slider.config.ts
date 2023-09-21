import { AuthSliderItem } from "@/modules/Auth/components/AuthPageSlider/AuthSlider.interfaces";

export const SLIDER_CONFIG: AuthSliderItem[] = [
  {
    key: "news",
    title: "Новости со всего мира",
    text: "Ежедневная подборка новостей из 10 000 источников, чтобы быть в курсе последних событий",
    alt: "Новости",
  },
  {
    key: "event",
    title: "Все самое интересное",
    text: "ЯRUS отслеживает сотни тысяч интересных событий по всей стране: от спектаклей до спортивных мероприятий",
    alt: "События",
  },
  {
    key: "video",
    title: "Смотрите где угодно",
    text: "ЯRUS предложит сотни тысяч видео и «сюжетов», которые будут интересны именно вам",
    alt: "Видео",
  },
];
