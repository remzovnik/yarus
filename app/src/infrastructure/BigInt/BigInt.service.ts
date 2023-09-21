import { AxiosRequestConfig } from "axios";

/** Сервис для обработки ответов api которые могут содержать цифровые значения с типом big-int */
export class BigIntService {
  static getAxiosConfig(config: AxiosRequestConfig = {}): AxiosRequestConfig {
    return { ...config, transformResponse: [(data) => data] };
  }

  private isBigNumber(num): boolean {
    return !Number.isSafeInteger(+num);
  }

  private enquoteBigNumber(jsonString, bigNumChecker): string {
    return jsonString.replaceAll(/([:\s\[,]*)(\d+)([\s,\]]*)/g, (matchingSubstr, prefix, bigNum, suffix) => {
      return bigNumChecker(bigNum) ? `${prefix}"${bigNum}"${suffix}` : matchingSubstr;
    });
  }

  private parseWithBigInt<T extends object>(jsonString, bigNumChecker): T {
    return JSON.parse(this.enquoteBigNumber(jsonString, bigNumChecker), (key, value) => {
      return !isNaN(value) && bigNumChecker(value) ? BigInt(value) : value;
    });
  }

  public parse<T extends object>(data: string): T {
    try {
      return this.parseWithBigInt<T>(data, this.isBigNumber);
    } catch (e) {
      console.error(e);
      return {} as T;
    }
  }
}
