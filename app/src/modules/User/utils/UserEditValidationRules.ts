import { required, helpers } from "@vuelidate/validators";

export const UserEditvalidationRules = (emailRegexpString: string) => {
  return {
    name: {
      required: helpers.withMessage("Имя обязательно к заполнению.", required),
    },
    surname: {
      required: helpers.withMessage("Фамилия обязательна к заполнению.", required),
    },
    nickname: {
      required: helpers.withMessage("Имя пользователя обязательно к заполнению.", required),
    },
    email: {
      check: helpers.withMessage("Неверный формат ввода", helpers.regex(new RegExp(emailRegexpString, "u"))),
    },
    photo: {
      required,
    },
  };
};
