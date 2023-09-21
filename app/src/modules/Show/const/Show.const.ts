import { Millisecond } from "@/modules/MediaLogger/domain/MediaLogger.types";

/** колличество миллисекунд после которого считаем, что просмотр готов и можно его отправлять на сервер */
export const SHOW_TIME: Millisecond = 2000;

/** Интервал между проверками готовности показов к отправки на сервер */
export const INTERVAL_SAVE_SHOW: Millisecond = 1000;

/** Интервал между отправками показов на сервер */
export const INTERVAL_SEND_SHOW: Millisecond = 10000;
