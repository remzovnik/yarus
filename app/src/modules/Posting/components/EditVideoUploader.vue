<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import { MediaUploadResponseModel, MediaUploadResponseTypes } from "@/modules/Posting/models/MediaUploadResponseModel";
import { EditVideoModel } from "@/modules/Posting/models/EditVideoModel";
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
    data: EditVideoModel;
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
  (event: "update", value: EditVideoModel): void;
}>();

const video = ref<EditVideoModel>(new EditVideoModel());
const videoStatus = ref<UploadMediaStatus | EValidationFileResult>(UploadMediaStatus.READY);
const coverStatus = ref<UploadMediaStatus | EValidationFileResult>(UploadMediaStatus.READY);
const wasFilled = ref<boolean>(false);
const wasVideoUploadingCancelled = ref<boolean>(false);
const wasImageUploadingCancelled = ref<boolean>(false);
const errorText = ref<string>("");

const hashtagCountService = new HashtagCountService();
const validationService = new ValidationFileService();

const updateVideo = (file: File | null): void => {
  if (file) {
    const validationResult: EValidationFileResult = validationService.check(EValidationFileTypes.VIDEO, file);
    if (validationResult !== EValidationFileResult.OK) {
      videoStatus.value = validationResult;
      resetVideo();
      return;
    }
  } else {
    videoStatus.value = UploadMediaStatus.ERROR;
    resetVideo();
    return;
  }

  uploadVideo(file);
};

const uploadVideo = async (file: File): Promise<void> => {
  videoStatus.value = UploadMediaStatus.LOADING;
  wasVideoUploadingCancelled.value = false;

  const response: MediaUploadResponseModel = await ServiceLocator.instance.getService(MediaService).uploadVideo(file);

  switch (response.status) {
    case MediaUploadResponseTypes.OK:
      video.value = new EditVideoModel({
        ...video.value,
        ...{
          id: response.message.body.task_id,
          wasFilled: wasFilled.value,
          transcodeResponse: response.message,
        },
      });

      videoStatus.value = UploadMediaStatus.LOADED;

      update();

      break;
    case MediaUploadResponseTypes.InvalidFormat:
      resetVideo();
      videoStatus.value = UploadMediaStatus.INVALID_FORMAT_ERROR;
      break;
    default:
      if (wasVideoUploadingCancelled.value) {
        videoStatus.value = UploadMediaStatus.READY;
      } else {
        videoStatus.value = UploadMediaStatus.ERROR;
        resetVideo();
      }

      break;
  }
};

const deleteVideo = (): void => {
  video.value = props.data.cover ? new EditVideoModel({ cover: props.data.cover }) : new EditVideoModel();

  update();

  videoStatus.value = UploadMediaStatus.READY;
};

const resetVideo = (): void => {
  video.value = new EditVideoModel();
};

const abortVideoLoading = (): void => {
  mediaStore.videoAbortController?.abort();

  wasVideoUploadingCancelled.value = true;
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
          video.value.cover = response.body;
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
  video.value.cover = null;
};

const update = (): void => {
  errorText.value = hashtagCountService.checkEditVideo(video.value);
  video.value.wasFilled = isVideoFilled.value;
  emit("update", video.value);
};

const abortCoverLoading = (): void => {
  mediaStore.imageAbortController?.abort();

  wasImageUploadingCancelled.value = true;
};

const isDeleteVideoAllowed = computed<boolean>(() => {
  return !!video.value.transcodeResponse && !props.isEditing;
});

const isDeleteCoverAllowed = computed<boolean>(() => {
  return !!video.value.cover && coverStatus.value === UploadMediaStatus.LOADED && !props.isEditing;
});

const isVideoFilled = computed<boolean>(() => {
  return !!video.value.title.trim().length && videoStatus.value === UploadMediaStatus.LOADED;
});

const currentVideoPreview = computed<string>(() => {
  return (props.isEditing ? video.value.video?.image : video.value?.transcodeResponse?.body.preview.original.url) || "";
});

const currentCover = computed<string>(() => {
  if (props.data.cover) {
    return isImageModelGuard(props.data.cover) ? props.data.cover?.original.url : props.data.cover;
  } else {
    return props.data.video?.image;
  }
});

watch(
  () => videoStatus.value,
  (newValue) => {
    if (newValue === UploadMediaStatus.LOADING) {
      emit("loadstart");
    } else {
      emit("loadend");
    }
  }
);

watchEffect(() => {
  if (!props.isEditing && isVideoFilled.value && !wasFilled.value) {
    wasFilled.value = true;
  }
});

onMounted(() => {
  videoStatus.value = props.data?.id ? UploadMediaStatus.LOADED : UploadMediaStatus.READY;
  coverStatus.value = !!currentCover.value ? UploadMediaStatus.LOADED : UploadMediaStatus.READY;

  video.value = props.data;
});
</script>

<template>
  <div class="video-uploader">
    <div class="video-uploader__dropzone-wrapper">
      <EditFileUploader
        :type="EFileUploaderTypes.VIDEO"
        class="video-uploader__dropzone-video"
        :cover="currentVideoPreview"
        :status="videoStatus"
        :is-disabled="isDisabled || isEditing || videoStatus === UploadMediaStatus.LOADING"
        :is-delete-allowed="isDeleteVideoAllowed"
        :loading-progress="mediaStore.videoUploadingProgress"
        @drop="updateVideo"
        @change="updateVideo"
        @delete="deleteVideo"
        @abort="abortVideoLoading"
      />

      <EditFileUploader
        :type="EFileUploaderTypes.VIDEO_COVER"
        class="video-uploader__dropzone-cover"
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
      v-model="video.title"
      :is-disabled="isDisabled"
      :custom-height="22"
      :maxlength="255"
      placeholder="Введите название видео *"
      @update:model-value="update"
    />
    <BaseTextarea
      v-model="video.description"
      class="video-uploader__text-field"
      :custom-height="22"
      placeholder="Введите описание к видео "
      @update:model-value="update"
    />
    <InlineErrorMessage :error-message="errorText" />
  </div>
</template>

<style lang="scss">
.video-uploader {
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

  &__dropzone-video {
    max-width: 44rem;
    height: 24.8rem;

    @media (max-width: $media-sm) {
      height: 16.2rem;
    }
  }

  &__dropzone-cover {
    max-width: 28.3rem;
    height: 16rem;
    margin-left: 2rem;

    @media (max-width: $media-md) {
      margin-top: 2rem;
      margin-left: 0;
    }

    @media (max-width: $media-sm) {
      width: 18.7rem;
      height: 16.2rem;
      margin-top: 1.6rem;
    }
  }

  &__text-field {
    margin-top: 1.6rem;
  }
}
</style>
