<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, inject, watch } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import AudioUploadModel from "@/modules/Posting/models/AudioUploadModel";
import { MediaUploadResponseModel, MediaUploadResponseTypes } from "@/modules/Posting/models/MediaUploadResponseModel";
import { eventsConfig } from "@/appConfig";

const emitter: any = inject("emitter");

enum UploadAudioStatus {
  LOADED = "loaded",
  LOADING = "loading",
  ERROR = "error",
  READY = "ready",
  INVALID_FORMAT_ERROR = "invalid_format",
}

const props = withDefaults(
  defineProps<{
    data: AudioUploadModel | null;
    isDisabled?: boolean;
    defaultAuthor?: string;
  }>(),
  {
    isDisabled: false,
    defaultAuthor: "",
  }
);

const emit = defineEmits<{
  (event: "loadstart"): void;
  (event: "loadend"): void;
  (event: "update", value: AudioUploadModel | null): void;
  (event: "errorValueChange", value: boolean): void;
}>();

const audio = ref<AudioUploadModel>(new AudioUploadModel());
const status = ref<UploadAudioStatus>();
const errorText = ref("Попробуйте снова");
const isValidationError = ref(false);

const isValid = computed<boolean>(() => {
  return !!audio.value && !!audio.value.artist && status.value === UploadAudioStatus.LOADED;
});

const onDropHandler = (event: DragEvent): void => {
  if (props.isDisabled) return;
  const loadedFile = event.dataTransfer?.files[0];

  startUploading(loadedFile);
};

const onChangeHandler = (event: Event): void => {
  const eventTarget = event.target as HTMLInputElement;
  const loadedFile = eventTarget.files ? eventTarget.files[0] : null;

  startUploading(loadedFile);
};

const startUploading = (loadedFile: File | undefined | null): void => {
  if (!loadedFile) {
    status.value = UploadAudioStatus.ERROR;
    return;
  }

  uploadAudio(loadedFile);
};

const uploadAudio = async (file: File): Promise<void> => {
  status.value = UploadAudioStatus.LOADING;

  if (file) {
    const response: MediaUploadResponseModel = await ServiceLocator.instance.getService(MediaService).uploadAudio(file);

    switch (response.status) {
      case MediaUploadResponseTypes.OK:
        audio.value = {
          audio: response.message,
          name: "",
          artist: props.defaultAuthor,
        } as AudioUploadModel;
        update();
        status.value = UploadAudioStatus.LOADED;
        break;
      case MediaUploadResponseTypes.InvalidFormat:
        status.value = UploadAudioStatus.INVALID_FORMAT_ERROR;
        break;
      default:
        status.value = UploadAudioStatus.ERROR;
        break;
    }
  }
};

const update = (): void => {
  emit("update", audio.value);
};

const checkErrors = (): void => {
  isValidationError.value = !isValid.value;
  emit("errorValueChange", isValidationError.value);
};

const rootClasses = computed<object>(() => {
  return {
    "posting-audio-uploader_loaded": status.value === UploadAudioStatus.LOADED,
    "posting-audio-uploader_disabled": props.isDisabled,
  };
});

watch(
  () => status.value,
  (newValue) => {
    if (newValue === UploadAudioStatus.LOADING) {
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

watch(
  () => props.data,
  () => {
    audio.value = props.data ? props.data : new AudioUploadModel();
    status.value = props.data ? UploadAudioStatus.LOADED : UploadAudioStatus.READY;
  },
  {
    immediate: true,
    deep: true,
  }
);

emitter.on(eventsConfig.formCheck, checkErrors);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.formCheck, checkErrors);
});
</script>

<template>
  <div class="posting-audio-uploader" :class="rootClasses">
    <div v-if="status === UploadAudioStatus.LOADED" class="posting-audio-uploader-result">
      <div class="posting-audio-uploader-result">
        <BaseButton icon="music" size="large" is-rounded />
        <BaseInput v-model="audio.name" class="posting-audio-uploader-result__title" placeholder="Введите название трека" />
        <p class="posting-audio-uploader-result__separator">–</p>
        <BaseInput
          v-model="audio.artist"
          class="posting-audio-uploader-result__author"
          :has-error="isValidationError"
          placeholder="Добавьте исполнителя"
        />
      </div>
    </div>
    <label v-else class="posting-audio-uploader__main" @drop.prevent="onDropHandler" @dragover.prevent>
      <input
        :disabled="isDisabled || status === UploadAudioStatus.LOADING"
        class="posting-audio-uploader__audio-input"
        type="file"
        title=""
        @change="onChangeHandler"
      />

      <span v-if="status === UploadAudioStatus.READY" class="posting-audio-uploader__ready-status">
        <span class="hide-mobile">Перетащите или выберите аудио</span>

        <span class="only-mobile">Выберите аудио</span>
      </span>

      <span v-if="status === UploadAudioStatus.LOADING" class="posting-audio-uploader__loading-status">
        <BaseIcon class="posting-audio-uploader__loading-icon" name="loading" />
        Подождите, идет загрузка
      </span>

      <span v-if="status === UploadAudioStatus.INVALID_FORMAT_ERROR" class="posting-audio-uploader__error-status">
        <BaseIcon class="posting-audio-uploader__error-icon" name="refresh-right" />
        Не поддерживается формат аудио.
      </span>

      <span v-if="status === UploadAudioStatus.ERROR" class="posting-audio-uploader__error-status">
        <BaseIcon class="posting-audio-uploader__error-icon" name="refresh-right" />
        {{ errorText }}
      </span>
    </label>
  </div>
</template>

<style lang="scss">
.posting-audio-uploader {
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
  }

  &__audio {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  }

  &__audio-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  &_loaded {
    .posting-audio-uploader__main {
      height: 30rem;

      @media (max-width: $media-sm) {
        width: 28.8rem;
        height: 19.2rem;
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

  .posting-audio-uploader-result {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__icon {
      @include sq(4.8rem);

      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      color: $white-100;
      background: $blue-100;
      border-radius: 50%;
    }

    &__title,
    &__author {
      flex-shrink: 1;

      .common-input__field {
        background-color: transparent;
        border: none;
      }
    }

    &__separator {
      flex-shrink: 1;
    }
  }

  .base-input__error-msg {
    display: none;
  }
}
</style>
