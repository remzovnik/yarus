export class ValidationService {
  public latinNumberDashUnderscore = () => (value: string) => {
    const expression = /^[a-zA-Z0-9_-]+$/gi;
    const regex = new RegExp(expression);
    return !value || (!!value.match(regex) && this.atLeastOneLetter()(value));
  };

  public noYarus = () => (value: string) => {
    return !/yarus/i.test(value);
  };

  public atLeastOneLetter = () => (value: string) => {
    const expression = /[A-Za-z]+/gi;
    const regex = new RegExp(expression);
    return !value || !!value.match(regex);
  };

  public minLength = (param: number) => (value: string) => {
    return !value || value.length >= param;
  };
}
