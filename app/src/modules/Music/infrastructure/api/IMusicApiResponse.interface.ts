export interface IMusicApiResponse<T> {
  data: T;
  meta: {
    limit: number;
    offset: number;
    totalCount: number;
  } | null;
}
