import CityModel from "@/modules/Main/models/CityModel";
import cities from "@/assets/data/cities.json";

export const formatPhoneNumber = (phoneNumberString: string) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
};

export const decOfNum = (number: number, titles: string[]) => {
  const decCases = [2, 0, 1, 1, 1, 2];
  const index = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
  return titles[index];
};

export const linkifyText = (inputText: string): string => {
  let replacedText = inputText;

  const escapeTags = (text: string): string => {
    const tagsToReplace = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
    };

    const replaceTag = (tag: string): string => {
      return tagsToReplace[tag] || tag;
    };

    const safeTagsReplace = (text: string): string => {
      return text.replace(/[&<>]/g, replaceTag);
    };

    return safeTagsReplace(text);
  };

  replacedText = escapeTags(replacedText);

  // URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-А-ЯЁA-Z0-9+&@#/%?=~_|!:,.;]*[-А-ЯЁA-Z0-9+&@#/%=~_|])/gim;
  replacedText = replacedText.replace(replacePattern1, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  const replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(replacePattern2, '$1<a href="https://$2" target="_blank" rel="noopener noreferrer">$2</a>');

  // Change email addresses to mailto:: links.
  const replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  const escapeRegExp = (text: string) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Hashtags
  replacedText
    .replace(new RegExp("<s*a[^>]*>(.*?)<s*/s*a>", "g"), "")
    .split(/\s+/)
    .filter((item) => item.includes("#"))
    .forEach((item) => {
      const wordRegex = /[#\wA-Z#\wa-z#\wа-яё#\wА-ЯЁ]+/gi;

      const punctuation = item.split(wordRegex);
      const hashtag = item.match(wordRegex)?.[0];
      const word = hashtag?.replace("#", "");
      const html = `${punctuation?.[0]}<router-link class="hashtag-link" to="/hashtag/${word}">${hashtag}</router-link>${punctuation?.[1]}`;
      const combine = new RegExp(`(\\s+|^)(${escapeRegExp(item)})(\\s+|$)`, "g");
      replacedText = replacedText.replace(combine, `$1${html}$3`);
    });

  replacedText = replacedText.replace(/\n/g, "<br/>");

  return replacedText;
};

export const duration = (time: number) => {
  const hourInSeconds = 3600;
  const minuteInSeconds = 60;
  const hours = Math.floor(time / hourInSeconds);
  const minutes = Math.floor((time - hours * hourInSeconds) / minuteInSeconds);
  const seconds = time - hours * hourInSeconds - minutes * minuteInSeconds;
  let result = "";

  if (!hours) {
    result = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  } else {
    result = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds}`;
  }

  return result;
};

export const kFormatter = (count: number): string => {
  const absValue = Math.abs(count);
  const signValue = Math.sign(count);

  if (absValue < 1000) {
    return String(signValue * absValue);
  } else if (absValue >= 1000 && absValue < 1000000) {
    return signValue * +(absValue / 1000).toFixed(1) + "К";
  } else {
    return signValue * +(absValue / 1000000).toFixed(1) + "М";
  }
};

export const cityInCase = (city: CityModel, cityCase: number): string => {
  const cityInCase = cities.find((item) => item.id === city.id);
  return cityInCase ? cityInCase.names[cityCase] : city.name;
};
