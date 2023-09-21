<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MediaService from "@/modules/Main/apiServices/MediaService";
import { ImageUploadModel } from "@/modules/Posting/models/ImageUploadModel";
import { eventsConfig } from "@/appConfig";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { isImageModelGuard } from "@/modules/Main/models/ImageModel";

const emitter: any = inject("emitter");

enum UploadImageStatus {
  LOADED = "loaded",
  LOADING = "loading",
  ERROR = "error",
  READY = "ready",
}

const props = withDefaults(
  defineProps<{
    data: ImageUploadModel | null;
    overlay?: boolean;
    isDisabled?: boolean;
    editView?: boolean;
  }>(),
  {
    isDisabled: false,
    editView: false,
  }
);

const emit = defineEmits<{
  (e: "loadstart"): void;
  (e: "loadend"): void;
  (e: "delete"): void;
  (e: "update", value: ImageUploadModel | null): void;
  (event: "errorValueChange", value: boolean): void;
}>();

const image = ref<ImageUploadModel | null>(null);
const status = ref<UploadImageStatus>();
const errorText = ref<string>("Попробуйте снова");
const isValidationError = ref(false);
const input = ref<HTMLInputElement | null>(null);

const isValid = computed<boolean>(() => {
  return status.value === UploadImageStatus.LOADED;
});

const onDropHandler = (event: DragEvent): void => {
  if (props.isDisabled) return;
  const file = event.dataTransfer?.files[0];

  if (file) {
    uploadImage(file);
  }
};

const onChangeHandler = (event: Event): void => {
  const eventTarget = event.target as HTMLInputElement;
  const loadedImage = eventTarget.files ? eventTarget.files[0] : null;

  if (loadedImage) {
    uploadImage(loadedImage);
  }
};

const uploadImage = async (file: File): Promise<void> => {
  status.value = UploadImageStatus.LOADING;

  if (file) {
    const response = await ServiceLocator.instance.getService(MediaService).uploadAndResizeImage(file);

    if (response.code === 200) {
      if (isImageModelGuard(response.body)) {
        image.value = {
          imageMobile: response.body.mobile.url,
          imageWidth: response.body.mobile.width,
          imageHeight: response.body.mobile.height,
          imageOriginal: response.body.original.url,
          widthImageOriginal: response.body.original.width,
          heightImageOriginal: response.body.original.height,
        };

        update();
        status.value = UploadImageStatus.LOADED;
      }
    } else {
      if (response.body) {
        if (!isImageModelGuard(response.body)) {
          errorText.value = response.body;
        }
      }
      status.value = UploadImageStatus.ERROR;
    }
  }
};

const checkErrors = (): void => {
  isValidationError.value = !isValid.value;
  emit("errorValueChange", isValidationError.value);
};

const update = (): void => {
  emit("update", image.value);
};

const deleteHandler = (): void => {
  emit("delete");
};

const clearInput = (): void => {
  if (input.value) {
    input.value.value = "";
  }
};

const classes = computed<StyleClasses>(() => {
  return {
    "posting-image-uploader_loaded": status.value === UploadImageStatus.LOADED,
    "posting-image-uploader_disabled": props.isDisabled,
    "posting-image-uploader_edit-view": props.editView,
  };
});

watch(
  () => status.value,
  (newValue) => {
    if (newValue === UploadImageStatus.LOADING) {
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
    if (!props.data) clearInput();
    image.value = props.data;
    status.value = image.value ? UploadImageStatus.LOADED : UploadImageStatus.READY;
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
  <div class="posting-image-uploader" :class="classes">
    <label
      class="posting-image-uploader__main"
      :class="status === UploadImageStatus.LOADED ? 'posting-image-uploader__main_filled' : ''"
      @drop.prevent="onDropHandler"
      @dragover.prevent
    >
      <input
        ref="input"
        :disabled="isDisabled || status === UploadImageStatus.LOADING"
        class="posting-image-uploader__image-input"
        type="file"
        @change="onChangeHandler"
      />

      <span v-if="status === UploadImageStatus.READY && !editView" class="posting-image-uploader__ready-status">
        <span class="hide-mobile">Перетащите или выберите изображение</span>

        <span class="only-mobile">Выберите изображение</span>
      </span>

      <span v-if="status === UploadImageStatus.READY && editView" class="posting-image-uploader__ready-status">
        <BaseIcon class="posting-image-uploader__ready-icon" name="upload" :size="40" />
        <span>Добавить фото</span>
      </span>

      <span v-if="status === UploadImageStatus.LOADING" class="posting-image-uploader__loading-status">
        <BaseIcon class="posting-image-uploader__loading-icon" name="loading" />
        Подождите, идет загрузка
      </span>

      <span v-if="status === UploadImageStatus.ERROR" class="posting-image-uploader__error-status">
        <BaseIcon class="posting-image-uploader__error-icon" name="refresh-right" />
        <span>{{ errorText }}</span>
      </span>

      <template v-if="status === UploadImageStatus.LOADED">
        <img class="posting-image-uploader__image" :src="image?.imageOriginal" alt="" />
      </template>

      <div v-if="overlay && status === UploadImageStatus.LOADED" class="posting-image-uploader__overlay">
        <BaseIcon class="posting-image-uploader__overlay-icon" name="image" :size="40" />
      </div>

      <BaseButton
        v-if="status === UploadImageStatus.LOADED && editView"
        icon="close"
        type="circle"
        size="medium"
        class="posting-image-uploader__delete-icon"
        @click.prevent="deleteHandler"
      />
    </label>
  </div>
</template>

<style lang="scss">
.posting-image-uploader {
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

  &__image {
    max-width: 100%;
    height: auto;
    object-fit: cover;
    object-position: 50% 0;
  }

  &__image-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  &_loaded {
    .posting-image-uploader__main {
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
    justify-content: center;
    width: 85%;
    padding: 0.8rem;
    color: $red-100;
  }

  &__error-icon {
    flex-shrink: 0;
    margin-right: 0.8rem;
  }

  &__delete-icon {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
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

  &_edit-view {
    .posting-image-uploader__main {
      width: 26.4rem;
      height: 16.2rem;

      @include body-16;

      color: $gray-600;
      border: 1px solid $gray-400;
      border-radius: $border-radius-sm;
    }

    .posting-image-uploader {
      &__ready-status {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__ready-icon {
        margin-bottom: 1.6rem;
      }
    }
  }
}
</style>
