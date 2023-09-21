import { IResponseTransitiveError } from "@/infrastructure/api/IApi.interfaces";

export interface IRegisterOptions extends IResponseTransitiveError {
  firstButton: string | null;
  secondButton: string | null;
  retryTimeout: number | null;
  text: string;
}
