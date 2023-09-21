<script lang="ts" setup>
import { computed, defineEmits, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import VideoUploadModel from "@/modules/Posting/models/VideoUploadModel";
import { MediaUploadResponseModel, MediaUploadResponseTypes } from "@/modules/Posting/models/MediaUploadResponseModel";
import InputTag from "@/modules/Main/components/form/InputTag.vue";
import { eventsConfig } from "@/appConfig";

const emitter: any = inject("emitter");

enum UploadVideoStatus {
  LOADED = "loaded",
  LOADING = "loading",
  ERROR = "error",
  READY = "ready",
  INVALID_FORMAT_ERROR = "invalid_format",
}

type viewType = "short" | "full";

const props = withDefaults(
  defineProps<{
    data: VideoUploadModel | null;
    type?: string;
    overlay?: boolean;
    isDisabled?: boolean;
  }>(),
  {
    type: "short",
    isDisabled: false,
  }
);

const emit = defineEmits<{
  (event: "loadstart"): void;
  (event: "loadend"): void;
  (event: "update", value: VideoUploadModel | null): void;
  (event: "errorValueChange", value: boolean): void;
}>();

const video = ref<VideoUploadModel>(new VideoUploadModel());
const status = ref<UploadVideoStatus>();
const errorText = ref("Попробуйте снова");
const isValidationError = ref(false);

const isValid = computed<boolean>(() => {
  return !!video.value.previewImage && !!video.value.name && status.value === UploadVideoStatus.LOADED;
});

const onDropHandler = (event: DragEvent): void => {
  if (props.isDisabled) return;
  const loadedFile = event.dataTransfer?.files[0];

  startUploading(loadedFile);
};

const onChangeHandler = (event: Event): void => {
  const eventTarget = event.target as HTMLInputElement;
  const loadedFile = eventTarget.files ? eventTarget.files[0] : null;

  if (loadedFile) {
    startUploading(loadedFile);
  }
};

const startUploading = (loadedFile: File | undefined | null): void => {
  if (!loadedFile) {
    status.value = UploadVideoStatus.ERROR;
    return;
  }

  uploadVideo(loadedFile);
};

const checkErrors = (): void => {
  isValidationError.value = !isValid.value;
  emit("errorValueChange", isValidationError.value);
};

const uploadVideo = async (file: File): Promise<void> => {
  status.value = UploadVideoStatus.LOADING;

  if (file) {
    const response: MediaUploadResponseModel = await ServiceLocator.instance.getService(MediaService).uploadVideo(file);

    switch (response.status) {
      case MediaUploadResponseTypes.OK:
        video.value.video = response.message;
        video.value.previewImage = response.message.body.preview.original.url;
        update();
        status.value = UploadVideoStatus.LOADED;
        break;
      case MediaUploadResponseTypes.InvalidFormat:
        status.value = UploadVideoStatus.INVALID_FORMAT_ERROR;
        break;
      default:
        status.value = UploadVideoStatus.ERROR;
        break;
    }
  }
};

const update = (): void => {
  emit("update", video.value);
};

const addTagHandler = (value: string): void => {
  if (!value) {
    return;
  }

  video.value.tags.push(value);
};

const removeTagHandler = (index: number): void => {
  video.value.tags.splice(index, 1);
};

const rootClasses = computed<object>(() => {
  return {
    "posting-video-uploader_loaded": status.value === UploadVideoStatus.LOADED,
    "posting-video-uploader_disabled": props.isDisabled,
  };
});

watch(
  () => status.value,
  (newValue) => {
    if (newValue === UploadVideoStatus.LOADING) {
      emit("loadstart");
    } else {
      emit("loadend");
    }
  }
);

watch(
  () => isValid.value,
  () => {
    checkErrors();
  }
);

onMounted(() => {
  video.value = props.data ? props.data : new VideoUploadModel();
  status.value = props.data ? UploadVideoStatus.LOADED : UploadVideoStatus.READY;
});

emitter.on(eventsConfig.formCheck, checkErrors);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.formCheck, checkErrors);
});
</script>

<template>
  <div class="posting-video-uploader" :class="rootClasses">
    <label
      class="posting-video-uploader__main"
      :class="status === UploadVideoStatus.LOADED ? 'posting-video-uploader__main_filled' : ''"
      @drop.prevent="onDropHandler"
      @dragover.prevent
    >
      <input
        :disabled="isDisabled || status === UploadVideoStatus.LOADING"
        class="posting-video-uploader__video-input"
        type="file"
        title=""
        @change="onChangeHandler"
      />

      <span
        v-if="status === UploadVideoStatus.READY"
        :class="isValidationError ? 'posting-video-uploader__error-status' : 'posting-video-uploader__ready-status'"
      >
        <span class="hide-mobile">Перетащите или выберите видео</span>

        <span class="only-mobile">Выберите видео</span>
      </span>

      <span v-if="status === UploadVideoStatus.LOADING" class="posting-video-uploader__loading-status">
        <BaseIcon class="posting-video-uploader__loading-icon" name="loading" />
        Подождите, идет загрузка
      </span>

      <span v-if="status === UploadVideoStatus.INVALID_FORMAT_ERROR" class="posting-video-uploader__error-status">
        <BaseIcon class="posting-video-uploader__error-icon" name="refresh-right" />
        Не поддерживается формат видео.
      </span>

      <span v-if="status === UploadVideoStatus.ERROR" class="posting-video-uploader__error-status">
        <BaseIcon class="posting-video-uploader__error-icon" name="refresh-right" />
        {{ errorText }}
      </span>

      <template v-if="status === UploadVideoStatus.LOADED">
        <img class="posting-video-uploader__image" :src="video?.previewImage" :alt="video?.name" />
      </template>

      <div v-if="overlay && status === UploadVideoStatus.LOADED" class="posting-video-uploader__overlay">
        <BaseIcon class="posting-video-uploader__overlay-icon" :size="48" name="films" />
      </div>
    </label>

    <BaseTextarea
      v-model="video.name"
      class="posting-video-uploader__title"
      :custom-height="22"
      placeholder="Введите название видео"
      :has-error="isValidationError"
    />

    <BaseTextarea
      v-if="type === 'full'"
      v-model="video.description"
      class="posting-video-uploader__description"
      :custom-height="22"
      placeholder="Введите описание к видео"
    />

    <div v-if="type === 'full'" class="posting-video-uploader-tags">
      <BaseTag
        v-for="(item, index) in video.tags"
        :key="`tag-${index}`"
        class="posting-video-uploader-tags__item"
        size="large"
        is-removable
        @remove="removeTagHandler(index)"
      >
        {{ item }}
      </BaseTag>
      <InputTag
        class="posting-video-uploader-tags__item posting-video-uploader-tags__item_input"
        placeholder="Введите тег"
        @create="addTagHandler"
      />
    </div>
  </div>
</template>

<style lang="scss">
.posting-video-uploader {
  &__main {
    @include label-16;

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 44rem;
    height: 13.2rem;
    overflow: hidden;
    border: 1px dashed $blue-100;
    border-radius: $border-radius-md;
    cursor: pointer;

    &_filled {
      border: 0;
    }
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }

  &__video-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  &_loaded {
    .posting-video-uploader__main {
      height: auto;

      @media (max-width: $media-sm) {
        width: 28.8rem;
        height: auto;
      }
    }
  }

  &__loading-status {
    display: flex;
    align-items: center;
  }

  &__loading-icon {
    margin-right: 0.8rem;
    animation: circling 1s linear infinite;
  }

  &__error-status {
    display: flex;
    align-items: center;
    padding: 0.8rem;
    color: $red-100;
  }

  &__error-icon {
    flex-shrink: 0;
    margin-right: 0.8rem;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white-100;
    background: $gray-600-gradient;
  }

  @keyframes circling {
    100% {
      transform: rotate(360deg);
    }
  }

  &__title {
    margin-top: 0.8rem;

    .common-input__field {
      @include headline-16;

      padding: 0;
      background-color: transparent;
      border: none;
      border-radius: 0;

      &::placeholder {
        @include headline-16;
      }
    }
  }

  &__description {
    margin-top: 0.8rem;

    .common-input__field {
      padding: 0;
      background-color: transparent;
      border: none;
    }
  }

  .posting-video-uploader-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0.8rem -0.4rem 0;

    &__item {
      margin: 0.4rem;
    }
  }

  .base-textarea__error-msg {
    display: none;
  }
}
</style>
