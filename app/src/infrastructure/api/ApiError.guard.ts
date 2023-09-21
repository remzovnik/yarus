import { IResponseNewError } from "@/infrastructure/api/IApi.interfaces";

export const isResponseNewErrorGuard = (response: any): response is IResponseNewError => {
  return (
    typeof response?.body === "string" &&
    typeof response?.code === "number" &&
    typeof response?.errorProcess === "string" &&
    typeof response?.errorProcess?.errorField === "string" &&
    typeof response?.status === "string"
  );
};
