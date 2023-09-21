import CityModel from "@/modules/Main/models/CityModel";

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};

const inputTimeOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC",
};

const postTimeOptions: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
};

const dateOptionsShort: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

const dateOptionsLong: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

const postDateOptionsLong: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const dateOptionsDay: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

const dateOptionsSeo: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
};

const eventFilterOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
};

const inputDateOptions: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
};

const decimalOfNumber = (number: number, titles: string[]): string => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
};

export const dateDiff = (timestamp: number, format = "full"): string => {
  const currentDate: any = new Date();
  const receivedDate: any = new Date(timestamp * 1000);
  let diff;

  if (receivedDate <= currentDate) {
    diff = new Date(currentDate - receivedDate);
  } else {
    diff = new Date(0);
  }

  const diffInYears = diff.getUTCFullYear() - 1970;
  const diffInMonth = diff.getUTCMonth();
  const diffInDays = diff.getUTCDate() - 1;
  const diffInHours = diff.getUTCHours();
  const diffInMinutes = diff.getUTCMinutes();

  let result;
  const isShort = format === "short";

  if (diffInYears) {
    const numerical = isShort ? "г." : decimalOfNumber(diffInYears, ["год", "года", "лет"]);
    result = `${diffInYears} ${numerical} назад`;
  } else if (diffInMonth) {
    const numerical = isShort ? "мес." : decimalOfNumber(diffInMonth, ["месяц", "месяца", "месяцев"]);
    result = `${diffInMonth} ${numerical} назад`;
  } else if (diffInDays) {
    const numerical = isShort ? "д." : decimalOfNumber(diffInDays, ["день", "дня", "дней"]);
    result = `${diffInDays} ${numerical} назад`;
  } else if (diffInHours) {
    const numerical = isShort ? "ч." : decimalOfNumber(diffInHours, ["час", "часа", "часов"]);
    result = `${diffInHours} ${numerical} назад`;
  } else if (diffInMinutes) {
    const numerical = isShort ? "мин." : decimalOfNumber(diffInMinutes, ["минута", "минуты", "минут"]);
    result = `${diffInMinutes} ${numerical} назад`;
  } else {
    result = "сейчас";
  }

  return result;
};

// 22 мая • 19:00-20:00
export const seanceCreateDate = (values: number[]): string => {
  const startSeconds = new Date(values[0] * 1000);
  const endSeconds = new Date(values[1] * 1000);

  const startDate = startSeconds.toLocaleString("ru-RU", dateOptionsShort);
  const startTime = startSeconds.toLocaleString("ru-RU", timeOptions);
  const endTime = endSeconds.toLocaleString("ru-RU", timeOptions);

  return `${startDate} • ${startTime} - ${endTime}`;
};

// 19:00
export const seanceTime = (value: number): string => {
  const seconds = new Date(value * 1000);
  const time = seconds.toLocaleString("ru-RU", timeOptions);
  return time;
};

// пт, 23 июля
export const seanceDay = (value: number): string => {
  const seconds = new Date(value * 1000);
  const day = seconds.toLocaleString("ru-RU", dateOptionsDay);
  return day;
};

// 8 сент. - 11 сент.
export const seanceFilter = (values: number[]): string => {
  const dateSince = new Date(values[0] * 1000);
  const dateTill = new Date(values[1] * 1000);
  const isSameDay =
    dateSince.getFullYear() === dateTill.getFullYear() &&
    dateSince.getMonth() === dateTill.getMonth() &&
    dateSince.getDate() === dateTill.getDate();
  const startLoc = dateSince.toLocaleDateString("ru-RU", eventFilterOptions);
  const endLoc = dateTill.toLocaleDateString("ru-RU", eventFilterOptions);

  return isSameDay ? startLoc : `${startLoc} - ${endLoc}`;
};

// 17 декабря 2020
export const postDate = (value: number): string => {
  const seconds = new Date(value * 1000);

  const date = seconds.toLocaleString("ru-RU", postDateOptionsLong);

  return `${date}`;
};

// 17 декабря 2020 • 14:37
export const postDateTime = (value: number): string => {
  const seconds = new Date(value * 1000);

  const date = seconds.toLocaleString("ru-RU", postDateOptionsLong);
  const time = seconds.toLocaleString("ru-RU", postTimeOptions);

  return `${date} • ${time}`;
};

// 17 декабря 2020 в 14:37
export const publishDateTime = (value: number): string => {
  const date = new Date(value * 1000);

  const day = date.toLocaleString("ru-RU", inputDateOptions);
  const time = date.toLocaleString("ru-RU", postTimeOptions);

  return `${day} в ${time}`;
};

// YYYY-MM-DD
export const postSeoDate = (value: number): string => {
  return new Date(value * 1000).toLocaleDateString("en-CA");
};

// DD.MM.YYYY
export const inputDate = (value: number): string => {
  const seconds = new Date(value * 1000);
  const day = seconds.toLocaleString("ru-RU", inputDateOptions);
  return day;
};

// 19:00:00
export const inputTime = (value: number): string => {
  const seconds = new Date(value * 1000);
  const time = seconds.toLocaleString("ru-RU", inputTimeOptions);
  return time;
};

// 2022-09-27T07:59:44.000Z
export const ISODate = (value: number): string => {
  return new Date(value * 1000).toISOString();
};

// 2022-09-27T07:59
export const ISODateShort = (value: number): string => {
  const v = ISODate(value);
  return v.replace(/:\d{2}(.|:)\d{3}Z$/g, "");
};

export const toUTC = (value: number | Date): number => {
  const seconds = new Date(value);
  const timezone = seconds.getTimezoneOffset() * 60000;
  seconds.setTime(seconds.getTime() - timezone);
  return Math.trunc((seconds as unknown as number) / 1000);
};

export const fromUTC = (value: number): number => {
  const seconds = new Date(value * 1000);
  const timezone = seconds.getTimezoneOffset() * 60000;
  seconds.setTime(seconds.getTime() + timezone);
  return seconds as unknown as number;
};

export const toUNIXinSeconds = (value: number): number => {
  return value / 1000;
};

export const toUNIXinMilliseconds = (value: number): number => {
  return value * 1000;
};

export const setTimezoneOffset = (value: number, cityID: number, cities: CityModel[]): number => {
  const city = cities.find((city) => city.id === cityID);
  if (city) {
    return value + city.timezoneOffset;
  } else {
    return value;
  }
};

export const setTimezoneOffsetBack = (value: number, cityID: number, cities: CityModel[]): number => {
  const city = cities.find((city) => city.id === cityID);
  if (city) {
    return value - city.timezoneOffset;
  } else {
    return value;
  }
};

export const updateTime = (date: number | Date, time: string): number => {
  const seconds = new Date(date);
  const year = seconds.getFullYear();
  const month = seconds.getMonth();
  const day = seconds.getDate();
  const hour = +time.substring(0, 2);
  const minute = +time.substring(2, 4);
  const second = +time.substring(4);
  return new Date(year, month, day, hour, minute, second).getTime();
};
