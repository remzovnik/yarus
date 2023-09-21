import { Id } from "@/_core/Base.type";
import { BaseService } from "@/_core/service/BaseService";
import { ETranslationStatus } from "@/domain/Translation/ETranslationStatus.enum";
import { IDtoTranslation } from "@/domain/Translation/IDtoTranslation.interface";
import { Translation } from "@/domain/Translation/Translation";
import { TranslationFactory } from "@/domain/Translation/Translation.factory";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { ITranslationGenerationData } from "@/modules/Translation/infrastructure/api/ITranslationGenerationData";
import { ITranslationResourceStatus } from "@/modules/Translation/infrastructure/api/ITranslationResourceStatus.interface";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export default class TranslationApiService extends BaseService {
  private readonly notify = useNotify();
  private translationFactory = new TranslationFactory();
  async getById(id: Id): Promise<Translation | null> {
    const dto: IDtoTranslation | null = await this.translationRequest<IDtoTranslation>(`video/${id}`);
    return dto ? this.translationFactory.create(dto) : null;
  }
  async updateTranslation(translation: Translation): Promise<Translation | false> {
    try {
      const dto: IDtoTranslation = await this.apiRequest.patch(`/video/${translation.id}`, translation);
      return dto ? this.translationFactory.create(dto) : false;
    } catch {
      return false;
    }
  }
  async createTranslation(): Promise<ITranslationGenerationData | null> {
    try {
      const response = await this.apiRequest.post<ITranslationGenerationData | null>(`streaming/create`);
      return response?.data || null;
    } catch (error: any) {
      this.showErrorAlert(error);
      return null;
    }
  }
  async checkStatus(resourceId: string): Promise<boolean> {
    try {
      let isReady = false;
      while (!isReady) {
        const response = await this.translationRequest<ITranslationResourceStatus>(`streaming/resource-status/${resourceId}`);
        if (response.status === ETranslationStatus.COMPLETED) {
          isReady = true;
        } else if (response.status === ETranslationStatus.ERROR) {
          return false;
        } else {
          await new Promise((r) => setTimeout(r, 15000));
        }
      }
      return true;
    } catch {
      return false;
    }
  }
  async activateTranslation(resourceId: string): Promise<boolean> {
    try {
      await this.apiRequest.post(`streaming/activate/${resourceId}`);
      return true;
    } catch {
      return false;
    }
  }
  private async translationRequest<T>(url: string, config?: AxiosRequestConfig, returnFalseIfFail = true): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiRequest.get<T>(url, config);
      return response.data;
    } catch (error: any) {
      this.showErrorAlert(error);
      return returnFalseIfFail ? false : error.request.data;
    }
  }
  private showErrorAlert(error: AxiosError) {
    if (error.response?.status === 409) {
      this.notify.message(true, "false", "У вас уже есть активная трансляция. Для запуска новой, необходимо её прекратить");
    } else {
      this.notify.message(true, "false", "Произошла ошибка");
    }

    console.log(error, error.message);
  }
}
