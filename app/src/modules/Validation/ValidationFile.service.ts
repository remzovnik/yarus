import { appConfig } from "@/appConfig";
import { EValidationFileTypes } from "@/modules/Validation/EValidationFileTypes.enum";
import { EValidationFileResult } from "@/modules/Validation/EValidationFileTypes.enum";

export class ValidationFileService {
  private file: File;
  private type: EValidationFileTypes;
  private error: EValidationFileResult = EValidationFileResult.OK;

  get allowedExtensions(): string[] {
    let envValue: string = "";

    switch (this.type) {
      case EValidationFileTypes.VIDEO: {
        envValue = appConfig.media.video.allowedExtensions;

        break;
      }

      case EValidationFileTypes.CLIP: {
        envValue = appConfig.media.clip.allowedExtensions;

        break;
      }

      case EValidationFileTypes.IMAGE: {
        envValue = appConfig.media.poster.allowedExtensions;
        break;
      }
    }

    return envValue.split(",");
  }

  get allowedSize(): number {
    let envValue: string = "";

    switch (this.type) {
      case EValidationFileTypes.VIDEO: {
        envValue = appConfig.media.video.allowedSize;

        break;
      }
      case EValidationFileTypes.CLIP: {
        envValue = appConfig.media.clip.allowedSize;

        break;
      }

      case EValidationFileTypes.IMAGE: {
        envValue = appConfig.media.poster.allowedSize;
      }
    }

    return +envValue;
  }

  public check = (type: EValidationFileTypes, file: File): EValidationFileResult => {
    this.error = EValidationFileResult.OK;

    this.file = file;
    this.type = type;

    this.checkExtension();
    this.checkSize();

    return this.error;
  };

  private checkExtension = (): void => {
    const splittedFileName: Array<string> = this.file.name.split(".");
    const fileExtension: string = splittedFileName[splittedFileName.length - 1].toLowerCase();

    if (!this.allowedExtensions.includes(fileExtension)) {
      this.error = EValidationFileResult.INVALID_FORMAT_ERROR;
    }
  };

  private checkSize = (): void => {
    if (this.file.size > this.allowedSize) {
      this.error = EValidationFileResult.INVALID_FORMAT_ERROR;
    }
  };
}
