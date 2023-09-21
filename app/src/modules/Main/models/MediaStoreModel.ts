export default class MediaStoreModel {
  videoUploadingProgress: number;
  videoAbortController?: AbortController;
  imageUploadingProgress: number;
  imageAbortController?: AbortController;
  clipUploadingProgress: number;
  clipAbortController?: AbortController;
}
