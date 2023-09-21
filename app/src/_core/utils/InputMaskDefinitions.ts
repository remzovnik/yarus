import IMask from "imask";

export const phoneMask = {
  mask: "+{7} (000) 000-00-00",
  lazy: false,
  placeholderChar: "_",
};

export const dateMask = {
  mask: Date,
  pattern: "d{.}`m{.}`Y",
  min: new Date(1900, 0, 1),
  max: new Date(2100, 0, 1),
  format(date) {
    if (!!date.getDate) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;

      return [day, month, year].join(".");
    } else {
      return date;
    }
  },
  parse(str) {
    const yearMonthDay = str.split(".");
    const date = new Date(yearMonthDay[2], yearMonthDay[1] - 1, yearMonthDay[0]);
    return date;
  },
  lazy: true,
  blocks: {
    d: {
      mask: IMask.MaskedRange,
      placeholderChar: "Ч",
      from: 1,
      to: 31,
      maxLength: 2,
    },
    m: {
      mask: IMask.MaskedRange,
      placeholderChar: "М",
      from: 1,
      to: 12,
      maxLength: 2,
    },
    Y: {
      mask: IMask.MaskedRange,
      placeholderChar: "Г",
      from: 1900,
      to: 2999,
      maxLength: 4,
    },
  },
};

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
export const dateMaskFuture = { ...dateMask, min: yesterday };

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() - 1);
export const dateMaskPast = { ...dateMask, max: tomorrow };

export const latinMask = {
  mask: /[a-zA-Z0-9._-]$/,
  lazy: true,
};

export const timeMask = {
  mask: "HH:mm:ss",
  blocks: {
    HH: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 23,
    },
    mm: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
    },
    ss: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
    },
  },
  lazy: true,
};

export const numberMask = {
  mask: "[0000000000]",
};

export const hoursMask = {
  mask: IMask.MaskedRange,
  from: 0,
  to: 23,
  maxLength: 2,
  placeholderChar: "0",
};

export const minutesMask = {
  mask: IMask.MaskedRange,
  from: 0,
  to: 59,
  maxLength: 2,
  placeholderChar: "0",
};
