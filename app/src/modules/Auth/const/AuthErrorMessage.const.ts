import { EAuthStatus } from "@/modules/Auth/models/AuthResult/EAuthResultStatus.enum";

export const AUTH_ERROR_MESSAGE: { [key in EAuthStatus]: string } = {
  [EAuthStatus.OK]: "",
  [EAuthStatus.USER_BLOCKED]: "Профиль заблокирован модерацией.",
  [EAuthStatus.USER_ALREADY_EXISTS]: "Ошибка! Пользователь с таким номером уже существует!",
  [EAuthStatus.UNKNOWN_ERROR]:
    "Произошла ошибка. Попробуйте через некоторое время заново отправить запрос.\nВ случае если проблема с входом продолжится, обратитесь в техническую поддержку: support@yarus.ru, указав ваш номер телефона.",
  [EAuthStatus.CODE_FAIL]: "Неверный смс‑код.",
  [EAuthStatus.FAIL]: "Что-то пошло не так",
  [EAuthStatus.REGISTER_OPTIONS]: "Воспользуйтесь вариантами получения кода доступа",
  [EAuthStatus.CAPTCHA_FAIL]: "Неверный текст captcha.",
};
