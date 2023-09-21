<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import { MediaUploadResponseModel, MediaUploadResponseTypes } from "@/modules/Posting/models/MediaUploadResponseModel";
import { EditClipModel } from "@/modules/Posting/models/EditClipModel";
import { useMediaStore } from "@/modules/Main/stores/MediaStore";
import { ImageResponseModel } from "@/modules/Main/models/ImageModel";
import { UploadMediaStatus } from "@/modules/Main/models/UploadMediaStatus.enum";
import { ValidationFileService } from "@/modules/Validation/ValidationFile.service";
import { EValidationFileTypes } from "@/modules/Validation/EValidationFileTypes.enum";
import { EValidationFileResult } from "@/modules/Validation/EValidationFileTypes.enum";
import EditFileUploader from "@/modules/Posting/components/FileUploader/FileUploader.vue";
import { EFileUploaderTypes } from "@/modules/Posting/components/FileUploader/EFileUploaderTypes.enum";
import { isImageModelGuard } from "@/modules/Main/models/ImageModel";
import { HashtagCountService } from "@/modules/Hashtag/services/HashtagCountService";
import InlineErrorMessage from "@/modules/Main/components/errors/InlineErrorMessage.vue";

const props = withDefaults(
  defineProps<{
    data: EditClipModel;
    isEditing?: boolean;
    isDisabled?: boolean;
    overlay?: boolean;
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
  (event: "update", value: EditClipModel): void;
}>();

const clip = ref<EditClipModel>(new EditClipModel());
const clipStatus = ref<UploadMediaStatus | EValidationFileResult>(UploadMediaStatus.READY);
const coverStatus = ref<UploadMediaStatus | EValidationFileResult>(UploadMediaStatus.READY);
const wasFilled = ref<boolean>(false);
const wasClipUploadingCancelled = ref<boolean>(false);
const wasImageUploadingCancelled = ref<boolean>(false);
const errorText = ref<string>("");

const hashtagCountService = new HashtagCountService();
const validationService = new ValidationFileService();

const updateClip = (file: File | null): void => {
  if (file) {
    const validationResult: EValidationFileResult = validationService.check(EValidationFileTypes.CLIP, file);

    if (validationResult !== EValidationFileResult.OK) {
      clipStatus.value = validationResult;
      resetClip();

      return;
    }
  } else {
    clipStatus.value = UploadMediaStatus.ERROR;
    resetClip();
    return;
  }

  startUploadClip(file);
};

const startUploadClip = (file: File): void => {
  uploadClip(file);
};

const uploadClip = async (file: File): Promise<void> => {
  clipStatus.value = UploadMediaStatus.LOADING;
  wasClipUploadingCancelled.value = false;

  if (file) {
    const response: MediaUploadResponseModel = await ServiceLocator.instance.getService(MediaService).uploadClip(file);

    switch (response.status) {
      case MediaUploadResponseTypes.OK:
        clip.value = new EditClipModel({
          ...clip.value,
          ...{
            id: response.message.body.task_id,
            wasFilled: wasFilled.value,
            transcodeResponse: response.message,
          },
        });

        clipStatus.value = UploadMediaStatus.LOADED;

        update();

        break;
      case MediaUploadResponseTypes.InvalidFormat:
        resetClip();
        clipStatus.value = UploadMediaStatus.INVALID_FORMAT_ERROR;
        break;
      default:
        if (wasClipUploadingCancelled.value) {
          clipStatus.value = UploadMediaStatus.READY;
        } else {
          clipStatus.value = UploadMediaStatus.ERROR;
          resetClip();
        }

        break;
    }
  }
};

const deleteClip = (): void => {
  clip.value = props.data.cover ? new EditClipModel({ cover: props.data.cover }) : new EditClipModel();

  update();

  clipStatus.value = UploadMediaStatus.READY;
};

const resetClip = (): void => {
  clip.value = new EditClipModel();
};

const abortClipLoading = (): void => {
  mediaStore.clipAbortController?.abort();

  wasClipUploadingCancelled.value = true;
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
          clip.value.cover = response.body;
        }
        update();

        coverStatus.value = UploadMediaStatus.LOADED;
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

const deleteCover = (): void => {
  resetCover();
  update();

  coverStatus.value = UploadMediaStatus.READY;
};

const resetCover = (): void => {
  clip.value.cover = null;
};

const update = (): void => {
  errorText.value = hashtagCountService.checkEditClip(clip.value);
  clip.value.wasFilled = isClipFilled.value;
  emit("update", clip.value);
};

const abortCoverLoading = (): void => {
  mediaStore.imageAbortController?.abort();

  wasImageUploadingCancelled.value = true;
};

const isDeleteClipAllowed = computed<boolean>(() => {
  return !!clip.value.transcodeResponse && !props.isEditing;
});

const isDeleteCoverAllowed = computed<boolean>(() => {
  return !!clip.value.cover && coverStatus.value === UploadMediaStatus.LOADED && !props.isEditing;
});

const isClipFilled = computed<boolean>(() => {
  return !!clip.value.description.trim().length && clipStatus.value === UploadMediaStatus.LOADED;
});

const currentClipPreview = computed<string>(() => {
  return (props.isEditing ? clip.value.clip?.image : clip.value?.transcodeResponse?.body.preview.original.url) || "";
});

const currentCover = computed<string>(() => {
  return props.data.cover?.original.url || props.data.clip?.image;
});

watch(
  () => clipStatus.value,
  (newValue) => {
    if (newValue === UploadMediaStatus.LOADING) {
      emit("loadstart");
    } else {
      emit("loadend");
    }
  }
);

watchEffect(() => {
  if (!props.isEditing && isClipFilled.value && !wasFilled.value) {
    wasFilled.value = true;
  }
});

onMounted(() => {
  clipStatus.value = props.data?.id ? UploadMediaStatus.LOADED : UploadMediaStatus.READY;
  coverStatus.value = !!currentCover.value ? UploadMediaStatus.LOADED : UploadMediaStatus.READY;

  clip.value = props.data;
});
</script>

<template>
  <div class="clip-uploader">
    <div class="clip-uploader__dropzone-wrapper">
      <EditFileUploader
        :type="EFileUploaderTypes.CLIP"
        class="clip-uploader__dropzone-clip"
        :cover="currentClipPreview"
        :status="clipStatus"
        :is-disabled="isDisabled || isEditing || clipStatus === UploadMediaStatus.LOADING"
        :is-delete-allowed="isDeleteClipAllowed"
        :loading-progress="mediaStore.clipUploadingProgress"
        @drop="updateClip"
        @change="updateClip"
        @delete="deleteClip"
        @abort="abortClipLoading"
      />

      <EditFileUploader
        :type="EFileUploaderTypes.CLIP_COVER"
        class="clip-uploader__dropzone-cover"
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
    </div>

    <BaseTextarea
      v-model="clip.description"
      class="clip-uploader__text-field"
      :custom-height="22"
      placeholder="Введите описание к сюжету *"
      @update:model-value="update"
    />
    <InlineErrorMessage :error-message="errorText" />
  </div>
</template>

<style lang="scss">
.clip-uploader {
  @media (max-width: $media-sm) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  &__dropzone-wrapper {
    display: flex;
    margin-bottom: 2.4rem;

    @media (max-width: $media-md) {
      flex-direction: column;
    }
  }

  &__dropzone-clip {
    max-width: 28.8rem;
    height: 51.38rem;
  }

  &__dropzone-cover {
    max-width: 21.2rem;
    height: 37.6rem;
    margin-left: 2rem;

    @media (max-width: $media-md) {
      margin-top: 2rem;
      margin-left: 0;
    }

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
    }
  }

  &__text-field {
    margin-top: 1.6rem;
  }
}
</style>
