import { required, helpers } from "@vuelidate/validators";

const smallerThan = (param) => (value) => +value <= +param.value;
const biggerThan = (param) => (value) => +value >= +param.value;
export const CreateSeanceValidationRules = (minPrice, maxPrice) => ({
  since: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
  },
  till: {},
  sinceTime: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
  },
  tillTime: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
  },
  cityID: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
  },
  address: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
  },
  minPrice: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
    mustBeSmaller: helpers.withMessage("Цена должна быть меньше максимальной.", smallerThan(maxPrice)),
  },
  maxPrice: {
    required: helpers.withMessage("Обязательно к заполнению.", required),
    mustBeBigger: helpers.withMessage("Цена должна быть больше минимальной.", biggerThan(minPrice)),
  },
  checkPrice: {},
});
