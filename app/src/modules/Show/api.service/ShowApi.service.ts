import { BaseService } from "@/_core/service/BaseService";
import { IResponseNewError } from "@/infrastructure/api/IApi.interfaces";
import { AxiosError, AxiosResponse } from "axios";

export class ShowApiService extends BaseService {
  async saveShowContent(data): Promise<boolean> {
    return this.apiRequest
      .post("/show", data)
      .then((response: AxiosResponse<{ status: string; text?: string }>) => {
        return true;
      })
      .catch((error: AxiosError<IResponseNewError>) => {
        console.error(error);
        return false;
      });
  }
}
