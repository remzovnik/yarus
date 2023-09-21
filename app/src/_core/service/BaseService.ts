import { plainToInstance } from "class-transformer";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { DataWithPaginationModel } from "../models/DataWithPaginationModel";
import type { App } from "vue";
import { AxiosInstance } from "axios";

export class BaseService {
  protected app: App;

  set vueApp(app: App) {
    this.app = app;
  }

  get vueApp() {
    return this.app;
  }

  get apiRequest(): AxiosInstance {
    return this.app.config.globalProperties.$axios;
  }

  get alertRequest(): AxiosInstance {
    return this.app.config.globalProperties.$alertAxios.get("alarm.json");
  }

  async getAnyOrNull(url: string, config?: any) {
    return await this.getAnyOrNullOrFail(false, url, config);
  }

  async getAnyOrFail(url: string, config?: any) {
    return await this.getAnyOrNullOrFail(true, url, config);
  }

  async getOneOrDefault<T>(Ctor: { new (): T }, url: string, config?: any): Promise<T> {
    return await this.getOneOrFailOrDefault(false, Ctor, url, config);
  }

  async getOneOrFail<T>(Ctor: { new (): T }, url: string, config?: any): Promise<T> {
    return await this.getOneOrFailOrDefault(true, Ctor, url, config);
  }

  async getOneOrDefaultPost<T>(Ctor: { new (): T }, url: string, config?: any, postData?: any): Promise<T> {
    return await this.getOneOrEmptyOrThrowErrorPost(false, Ctor, url, config, postData);
  }

  async getOneOrFailPost<T>(Ctor: { new (): T }, url: string, config?: any, postData?: any): Promise<T> {
    return await this.getOneOrEmptyOrThrowErrorPost(true, Ctor, url, config, postData);
  }

  async getArrayOrEmpty<T>(ctor: { new (): T }, url: string, config?: any): Promise<T[]> {
    return await this.getArrayOrEmptyOrFail(false, ctor, url, config);
  }

  async getArrayOrFail<T>(ctor: { new (): T }, url: string, config?: any): Promise<T[]> {
    return await this.getArrayOrEmptyOrFail(true, ctor, url, config);
  }

  async getArrayOrEmptyPost<T>(ctor: { new (): T }, url: string, config?: any, postData?: any): Promise<T[]> {
    try {
      const response = await this.apiRequest.post(url, postData, config);
      const data = response?.data?.data || response?.data;
      return !!data ? plainToInstance(ctor, Array.from(data)) : [];
    } catch {
      return [];
    }
  }

  // FIXME: тут еще с ошибкой
  async getArrayOrEmptyWithPagination<T>(
    ctor: { new (): T },
    url: string,
    params?: any,
    pagination?: PaginationModel
  ): Promise<DataWithPaginationModel<T>> {
    return await this.getArrayOrEmptyWithPaginationAny(ctor, url, params, pagination, false);
  }

  async getArrayOrEmptyWithPaginationPost<T>(
    ctor: { new (): T },
    url: string,
    params?: any,
    postData?: any,
    pagination?: PaginationModel
  ): Promise<DataWithPaginationModel<T>> {
    return await this.getArrayOrEmptyWithPaginationAny(ctor, url, params, pagination, true, postData);
  }

  //  postForm(url: string, config?: any, formData?: FormData): Promise<ApiResponse> {
  //   config.headers = {
  //     ...config.headers,
  //     ...{
  //       "Content-Type": "multipart/form-data",
  //     },
  //   };

  //   return this.post(url, { ...config }, formData);
  // }

  get currentTimestamp() {
    return Math.ceil(Date.now() / 1000);
  }

  uniqueBy = <T>(uniqueKey: keyof T, objects: T[]): T[] => {
    const ids = objects.map((object) => object[uniqueKey]);
    return objects.filter((object, index) => !ids.includes(object[uniqueKey], index + 1));
  };

  private async getAnyOrNullOrFail(isSendError = false, url: string, config?: any) {
    try {
      const response = await this.apiRequest.get(url, config);
      return response?.data?.data || response?.data;
    } catch (err) {
      if (isSendError) {
        throw err;
      } else {
        return null;
      }
    }
  }

  private async getOneOrFailOrDefault<T>(isSendError = false, Ctor: { new (): T }, url: string, config?: any): Promise<T> {
    try {
      const response = await this.apiRequest.get(url, config);
      const data = response?.data?.data || response?.data;
      const result = !!data ? (Array.isArray(data) && data.length > 0 ? data[0] : data) : null;
      return !!result ? plainToInstance(Ctor, result) : new Ctor();
    } catch (err) {
      if (isSendError) {
        throw err;
      } else {
        return new Ctor();
      }
    }
  }

  private async getArrayOrEmptyOrFail<T>(isSendError = false, ctor: { new (): T }, url: string, config?: any): Promise<T[]> {
    try {
      const response = await this.apiRequest.get(this.buildQueryWithPagination(url), config);
      const data = response?.data?.data || response?.data;
      return !!data ? plainToInstance(ctor, Array.from(data)) : [];
    } catch (err) {
      if (isSendError) {
        throw err;
      } else {
        return [];
      }
    }
  }

  private async getOneOrEmptyOrThrowErrorPost<T>(
    isSendError = false,
    Ctor: { new (): T },
    url: string,
    config?: any,
    postData?: any
  ): Promise<T> {
    try {
      const response = await this.apiRequest.post(url, postData, config);
      const data = response?.data?.data || response?.data;
      const result = !!data ? (Array.isArray(data) && data.length > 0 ? data[0] : data) : null;
      return !!result ? plainToInstance(Ctor, result) : new Ctor();
    } catch (err) {
      if (isSendError) {
        throw err;
      } else {
        return new Ctor();
      }
    }
  }

  private async getArrayOrEmptyWithPaginationAny<T>(
    ctor: { new (): T },
    url: string,
    config?: any,
    pagination?: PaginationModel,
    isPostMethod = false,
    postData?: any
  ): Promise<DataWithPaginationModel<T>> {
    const paginCollection = new DataWithPaginationModel<T>();

    try {
      let response: any;
      if (isPostMethod) {
        response = await this.apiRequest.post(this.buildQueryWithPagination(url, pagination), postData, config);
      } else {
        response = await this.apiRequest.get(this.buildQueryWithPagination(url, pagination), config);
      }

      const data = response?.data?.data || response?.data;
      paginCollection.data = !!data ? plainToInstance(ctor, Array.from(data)) : [];
      // Разберемся с пагинацией. Везде по разному, обобщим.
      if (response?.data?.meta) {
        const meta = response?.data?.meta;
        if (!!meta) {
          const pag = plainToInstance<PaginationModel, any>(PaginationModel, meta) as any;
          paginCollection.pagination = pag;
        }
      } else {
        paginCollection.pagination = pagination as PaginationModel;
        // paginCollection.pagination.currentPage = paginCollection.pagination.currentPage + 1;
      }
      if (response?.data?.count > -1 && !!paginCollection.pagination) {
        paginCollection.pagination = pagination as PaginationModel;
        paginCollection.pagination.total = response.data.count;
      }

      paginCollection.seo = response?.data?.seo || {};
    } catch (err) {
      return paginCollection;
    }
    return paginCollection;
  }

  getIdBySlug(slug: string) {
    let result = 0;

    if (!!slug && slug.toString().includes("-")) {
      const tryGet = Number(slug.split("-").pop());
      result = Number.isNaN(tryGet) ? 0 : tryGet;
    }

    if (!!slug && result === 0) {
      result = Number(slug);
    }

    return result;
  }

  protected buildQueryWithPagination(query: string, pagination?: PaginationModel): string {
    if (!!pagination) {
      query = query.includes("?")
        ? query + `&page=${pagination.currentPage || 1}`
        : query + `?page=${pagination.currentPage || 1}`;
      if (pagination.perPage) {
        query = query + `&limit=${pagination.perPage}`;
      }
    }
    return query;
  }
}
