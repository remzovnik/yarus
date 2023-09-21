import { UploadMediaStatus } from "@/modules/Main/models/UploadMediaStatus.enum";

export interface IValidationFileResult {
  isValid: boolean;
  error: null | UploadMediaStatus;
}
