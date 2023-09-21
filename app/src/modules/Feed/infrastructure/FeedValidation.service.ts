import { helpers, maxLength, minLength } from "@vuelidate/validators";
import { ValidationService } from "@/infrastructure/Validation/Validation.service";

export class FeedValidationService {
  private readonly validationService: ValidationService;

  constructor() {
    this.validationService = new ValidationService();
  }

  public createSubmitRules = () => {
    return {
      slug: {
        minLength: helpers.withMessage(
          "Слишком короткое название. Минимальное количество знаков - 3.",
          this.validationService.minLength(3)
        ),
        maxLength: helpers.withMessage("Слишком длинное название. Максимальное количество знаков - 40.", maxLength(40)),
        latinNumberUnderscore: helpers.withMessage(
          "Введите латинские буквы и/или допустимые символы",
          this.validationService.latinNumberDashUnderscore()
        ),
        noYarus: helpers.withMessage("Не используйте сочетание “yarus” в названии ленты", this.validationService.noYarus()),
      },
    };
  };
}
