import { plainToClass } from "class-transformer";

export type ConstructorOfBaseViewModel<T extends BaseViewModel> = new (...args: any[]) => T;

export class BaseViewModel {
  toJSON() {
    return { ...this };
  }

  parse() {
    return JSON.parse(JSON.stringify(this));
  }

  cloneAndRemoveEmptyValue(exceptPropNames?: string[]) {
    return BaseViewModel.cloneAndRemoveEmptyValue(this, exceptPropNames);
  }

  static cloneAndRemoveEmptyValue(obj: any, exceptPropNames?: string[]) {
    const cloned = JSON.parse(JSON.stringify(obj));
    for (const iterKey in cloned) {
      if (!exceptPropNames?.includes(iterKey)) {
        if (!cloned[iterKey] || cloned[iterKey].length === 0) {
          delete cloned[iterKey];
        }
      }
    }
    return cloned;
  }

  static fromPlainIfNotClass<T extends BaseViewModel>(ctor: ConstructorOfBaseViewModel<T>, classOrPlain: any): T | any {
    return this instanceof ctor ? classOrPlain : plainToClass(ctor, classOrPlain, { ignoreDecorators: true });
  }
}

// BaseViewModel.fromPlainIfNotClass = <T extends BaseViewModel>(ctor: ConstructorOfBaseViewModel<T>, classOrPlain: any) => {
//   return this instanceof ctor ? classOrPlain : plainToClass(ctor, classOrPlain, { ignoreDecorators: true });
// }
