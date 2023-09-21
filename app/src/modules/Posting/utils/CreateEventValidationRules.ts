import { required, helpers, integer, url } from "@vuelidate/validators";

export const CreateEventValidationRules = () => {
  return {
    ageRestriction: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
    },
    categoryID: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
    },
    description: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
    },
    detailURL: {
      url: helpers.withMessage("Введите корректный адрес. Например, https://yarus.ru", url),
    },
    isOnline: {},
    link: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
      url: helpers.withMessage("Введите корректный адрес. Например, https://yarus.ru", url),
    },
    name: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
    },
    photos: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
    },
    seances: {
      required: helpers.withMessage("Обязательно к заполнению.", required),
    },
    sourceKind: {},
    tags: {},
    isStory: {},
  };
};
