import { required, helpers, email } from "@vuelidate/validators";

export const FeedbackValidationRules = () => {
  return {
    name: {
      required: helpers.withMessage("Обязательно к заполнению", required),
    },
    phone: {},
    email: {
      required: helpers.withMessage("Обязательно к заполнению", required),
      email: helpers.withMessage("Введите корректный E-mail. Например,  mail@example.com", email),
    },
    text: {
      required: helpers.withMessage("Обязательно к заполнению", required),
    },
  };
};
