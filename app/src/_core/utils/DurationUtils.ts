//@ts-nocheck
//TODO: включить тс

// HH:MM:SS
export const durationFormatter = (time) => {
  const hourInSeconds = 3600;
  const minuteInSeconds = 60;
  const hours = Math.floor(time / hourInSeconds);
  let minutes = Math.floor((time - hours * hourInSeconds) / minuteInSeconds);
  let seconds = time - hours * hourInSeconds - minutes * minuteInSeconds;
  let result = "";

  seconds = seconds < 10 ? `0${seconds}` : seconds;

  if (!hours) {
    result = `${minutes}:${seconds}`;
  } else {
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    result = `${hours}:${minutes}:${seconds}`;
  }

  return result;
};

export const durationFormatterRoundDown = (time) => {
  return durationFormatter(Math.floor(time) || 0);
};

// P(n)Y(n)M(n)DT(n)H(n)M(n)S
export const durationISO = (seconds) => {
  const date = new Date(null);
  date.setSeconds(seconds);
  const timeArr = date.toISOString().substr(11, 8).split(":");

  let result = "PT";
  const times = ["H", "M", "S"];

  timeArr.forEach((item, id) => {
    if (Number(item)) {
      result += `${Number(item)}${times[id]}`;
    }
  });

  return result;
};
