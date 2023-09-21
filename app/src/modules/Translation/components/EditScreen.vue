<script setup lang="ts">
import { EFileUploaderTypes } from "@/modules/Posting/components/FileUploader/EFileUploaderTypes.enum";
import { UploadMediaStatus } from "@/modules/Main/models/UploadMediaStatus.enum";
import { computed, onMounted, ref } from "vue";
import { EValidationFileResult, EValidationFileTypes } from "@/modules/Validation/EValidationFileTypes.enum";
import { ValidationFileService } from "@/modules/Validation/ValidationFile.service";
import { ImageResponseModel, isImageModelGuard } from "@/modules/Main/models/ImageModel";
import { MediaUploadResponseModel } from "@/modules/Posting/models/MediaUploadResponseModel";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import { Translation } from "@/domain/Translation/Translation";
import { useMediaStore } from "@/modules/Main/stores/MediaStore";
import FileUploader from "@/modules/Posting/components/FileUploader/FileUploader.vue";
import BaseButton from "@/modules/Base/components/BaseButton.vue";
import { TranslationFactory } from "@/domain/Translation/Translation.factory";

const props = withDefaults(
  defineProps<{
    data: Translation;
    isEditing?: boolean;
    isDisabled?: boolean;
  }>(),
  {
    isDisabled: false,
    isEditing: false,
  }
);
const mediaStore = useMediaStore();
const emit = defineEmits<{
  (event: "loadstart"): void;
  (event: "loadend"): void;
  (event: "moveBack"): void;
  (event: "update", value: Translation): void;
}>();
const translationFactory = new TranslationFactory();
const translation = ref<Translation>(props.data);
const validationService = new ValidationFileService();
const wasImageUploadingCancelled = ref<boolean>(false);
const errorText = ref<string>("");
const coverStatus = ref<UploadMediaStatus | EValidationFileResult>(UploadMediaStatus.READY);
const resetCover = (): void => {
  translation.value.cover = null;
};
const uploadCover = async (formData: FormData): Promise<void> => {
  coverStatus.value = UploadMediaStatus.LOADING;
  wasImageUploadingCancelled.value = false;

  const file = formData.get("file");

  if (file) {
    const response: ImageResponseModel | MediaUploadResponseModel = await ServiceLocator.instance
      .getService(MediaService)
      .uploadAndResizeImage(file);

    switch (response.status) {
      case "ok":
        if (isImageModelGuard(response.body)) {
          translation.value.cover = response.body;
        }

        coverStatus.value = UploadMediaStatus.LOADED;
        update();
        break;

      default:
        if (wasImageUploadingCancelled.value) {
          coverStatus.value = UploadMediaStatus.READY;
        } else {
          coverStatus.value = UploadMediaStatus.ERROR;
          resetCover();
        }

        break;
    }
  }
};
const updateCover = (file: File | null): void => {
  if (file) {
    const validationResult: EValidationFileResult = validationService.check(EValidationFileTypes.IMAGE, file);
    if (validationResult !== EValidationFileResult.OK) {
      coverStatus.value = validationResult;
      resetCover();
      return;
    }
  } else {
    coverStatus.value = UploadMediaStatus.ERROR;
    resetCover();
    return;
  }
  startUploadCover(file);
};
const startUploadCover = (file: File): void => {
  const formData = new FormData();
  formData.append("file", file);
  uploadCover(formData);
};
const update = (): void => {
  translation.value.wasFilled = coverStatus.value === UploadMediaStatus.LOADED;
  emit("update", translation.value);
};

const isDeleteCoverAllowed = computed<boolean>(() => {
  return !!translation.value.cover && coverStatus.value === UploadMediaStatus.LOADED && !props.isEditing;
});
const currentCover = computed<string>(() => {
  if (props.data.cover) {
    return isImageModelGuard(props.data.cover) ? props.data.cover?.original.url : props.data.cover;
  } else {
    return props.data.image;
  }
});

const deleteCover = (): void => {
  resetCover();
  update();

  coverStatus.value = UploadMediaStatus.READY;
};

const abortCoverLoading = (): void => {
  mediaStore.imageAbortController?.abort();
  wasImageUploadingCancelled.value = true;
};

const moveBack = (): void => {
  emit("moveBack");
};

onMounted(() => {
  coverStatus.value = !!currentCover.value ? UploadMediaStatus.LOADED : UploadMediaStatus.READY;
  translation.value = props.data;
});
</script>

<template>
  <div :key="translation.id">
    <FileUploader
      :type="EFileUploaderTypes.VIDEO_COVER"
      is-required
      class="translation-uploader__dropzone-cover"
      :cover="currentCover"
      :status="coverStatus"
      :is-disabled="isDisabled || coverStatus === UploadMediaStatus.LOADING"
      :is-delete-allowed="isDeleteCoverAllowed"
      :loading-progress="mediaStore.imageUploadingProgress"
      @drop="updateCover"
      @change="updateCover"
      @delete="deleteCover"
      @abort="abortCoverLoading"
    />
    <BaseTextarea
      v-model="translation.name"
      :is-disabled="isDisabled"
      :custom-height="22"
      :maxlength="255"
      placeholder="Введите название трансляции *"
      @update:model-value="update"
    />
    <BaseTextarea
      v-model="translation.description"
      class="translation-uploader__text-field"
      :custom-height="22"
      placeholder="Введите описание к трансляции "
      @update:model-value="update"
    />
  </div>
  <div v-if="!isEditing" class="translation-loading-page__footer">
    <BaseButton is-only-icon icon="arrow-left" is-outlined @click="moveBack" />
    <div class="translation-loading-page__step">Шаг 2 из 2</div>
  </div>
</template>
<style lang="scss">
.translation-uploader {
  &__dropzone-cover {
    max-width: 44rem;
    height: 24.8rem;
    margin-bottom: 2.4rem;
  }

  &__text-field {
    margin-top: 1.6rem;
  }
}
</style>
