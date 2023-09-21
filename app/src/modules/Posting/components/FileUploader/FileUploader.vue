<script lang="ts" setup>
import { computed, ref } from "vue";
import { UploadMediaStatus } from "@/modules/Main/models/UploadMediaStatus.enum";
import { EValidationFileResult } from "@/modules/Validation/EValidationFileTypes.enum";
import { EFileUploaderTypes } from "@/modules/Posting/components/FileUploader/EFileUploaderTypes.enum";
import { IFileUploaderTextSet } from "@/modules/Posting/components/FileUploader/IFileUploaderTextSet.interface";
import {
  VIDEO_TEXT_SET,
  CLIP_TEXT_SET,
  IMAGE_TEXT_SET,
  DEFAULT_TEXT_SET,
} from "@/modules/Posting/components/FileUploader/FileUploader.const";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const emit = defineEmits<{
  (event: "drop", value: File | null): void;
  (event: "change", value: File | null): void;
  (event: "delete"): void;
  (event: "abort"): void;
}>();

const props = withDefaults(
  defineProps<{
    type: EFileUploaderTypes;
    status: UploadMediaStatus | EValidationFileResult;
    cover?: string;
    loadingProgress: number;
    isDisabled: boolean;
    isDeleteAllowed: boolean;
    isRequired?: boolean;
  }>(),
  {
    isRequired: false,
  }
);

const ERROR_TEXT = "Попробуйте снова";

const inputEl = ref<HTMLInputElement | undefined>();

const dropHandler = (event: DragEvent): void => {
  const loadedFile = event.dataTransfer?.files[0] || null;

  emit("drop", loadedFile);
};

const changeHandler = (event: Event): void => {
  const eventTarget = event.target as HTMLInputElement;
  const loadedFile = eventTarget.files ? eventTarget.files[0] : null;

  if (loadedFile) {
    emit("change", loadedFile);
  }
};

const deleteHandler = (): void => {
  emit("delete");
  clearInput();
};

const abortHandler = (): void => {
  if (props.loadingProgress < 100) {
    emit("abort");
    clearInput();
  }
};

const clearInput = (): void => {
  if (inputEl.value) {
    inputEl.value.value = "";
  }
};

const textSet = computed<IFileUploaderTextSet>(() => {
  switch (props.type) {
    case EFileUploaderTypes.VIDEO: {
      return VIDEO_TEXT_SET;
    }

    case EFileUploaderTypes.CLIP: {
      return CLIP_TEXT_SET;
    }

    case EFileUploaderTypes.VIDEO_COVER: {
      return IMAGE_TEXT_SET;
    }

    case EFileUploaderTypes.CLIP_COVER: {
      return IMAGE_TEXT_SET;
    }

    default: {
      return DEFAULT_TEXT_SET;
    }
  }
});

const acceptedFileTypes = computed<string>(() => {
  switch (props.type) {
    case EFileUploaderTypes.VIDEO: {
      return import.meta.env.VITE_YARUS_VIDEO_ALLOWED_TYPES;
    }

    case EFileUploaderTypes.CLIP: {
      return import.meta.env.VITE_YARUS_CLIP_ALLOWED_TYPES;
    }

    case EFileUploaderTypes.VIDEO_COVER || EFileUploaderTypes.CLIP_COVER: {
      return import.meta.env.VITE_YARUS_IMAGE_ALLOWED_TYPES;
    }

    default: {
      return "";
    }
  }
});

const classes = computed<StyleClasses>(() => {
  return {
    "file-uploader_covered": !!props.cover && props.status === UploadMediaStatus.LOADED,
    "file-uploader_disabled": props.isDisabled,
  };
});
</script>

<template>
  <label class="file-uploader" :class="classes" @drop.prevent="dropHandler" @dragover.prevent>
    <input
      ref="inputEl"
      class="file-uploader__input"
      type="file"
      :disabled="isDisabled"
      title=""
      :accept="acceptedFileTypes"
      @change="changeHandler"
    />

    <span v-if="status === UploadMediaStatus.READY" class="file-uploader__ready-status">
      <span class="hide-mobile">Перетащите или <br v-if="!isRequired" /></span
      ><span class="file-uploader__accent-text">{{ textSet.ready }}</span>
      <span v-if="isRequired" class="file-uploader__required-text">Обязательное поле*</span>
    </span>

    <span v-if="status === UploadMediaStatus.LOADING" class="file-uploader__loading-status">
      <div class="file-uploader__loading-text">
        <BaseIcon class="file-uploader__loading-icon" name="loader" />
        Подождите, идет загрузка
      </div>

      <div class="file-uploader__loading-progress">{{ loadingProgress }}%</div>

      <BaseButton class="file-uploader__loading-abort" subtype="text" size="large" @click.prevent="abortHandler"
        >Отменить загрузку</BaseButton
      >
    </span>

    <span v-if="status === EValidationFileResult.INVALID_FORMAT_ERROR" class="file-uploader__error-status">
      <BaseIcon class="file-uploader__error-icon" name="refresh-right" />
      {{ textSet.invalidFormatError }}
    </span>

    <span v-if="status === EValidationFileResult.INVALID_SIZE_ERROR" class="file-uploader__error-status">
      <BaseIcon class="file-uploader__error-icon" name="refresh-right" />
      {{ textSet.invalidSizeError }}
    </span>

    <span v-if="status === UploadMediaStatus.ERROR" class="file-uploader__error-status">
      <BaseIcon class="file-uploader__error-icon" name="refresh-right" />
      {{ ERROR_TEXT }}
    </span>

    <template v-if="status === UploadMediaStatus.LOADED">
      <img class="file-uploader__image" :src="cover" alt="" />
    </template>

    <template v-if="status === UploadMediaStatus.PUBLISHED">
      <img class="file-uploader__image" :src="cover" alt="" />
    </template>

    <BaseButton
      v-if="isDeleteAllowed"
      type="circle"
      class="file-uploader__delete-button"
      icon="delete"
      :icon-size="24"
      aria-label="Удаление"
      @click.prevent="deleteHandler"
    />
  </label>
</template>

<style lang="scss">
.file-uploader {
  @include label-16;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  text-align: center;
  border: 1px dashed $blue-100;
  border-radius: $border-radius-md;
  cursor: pointer;

  &__delete-button {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
    z-index: 2;
    color: $gray-400;
    transition: all $trs-back;

    &:hover {
      color: $gray-600;
      transition: all $trs-forward;
    }

    @media (max-width: $media-sm) {
      display: flex;
      align-self: end;
      margin-bottom: 0.8rem;
    }
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__accent-text {
    color: $blue-100;

    @media (max-width: $media-sm) {
      text-transform: capitalize;
    }
  }

  &__required-text {
    @include body-14;

    display: block;
    margin-top: 1.6rem;
    color: $gray-650;
    text-align: center;
  }

  &__loading-status {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__loading-text {
    display: flex;
    align-items: center;
  }

  &__loading-icon {
    margin-right: 0.8rem;
  }

  &__loading-progress {
    margin-top: 0.8rem;
  }

  &__loaded-icon {
    @include absolute-center;

    color: $white-100;
  }

  &__loading-abort {
    margin-top: 0.8rem;
  }

  &__error-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.8rem;
    color: $red-100;
  }

  &__error-icon {
    flex-shrink: 0;
    margin-right: 0.8rem;
  }

  &__text-field {
    margin-top: 1.6rem;
  }

  &_covered {
    background-color: $black-100;
  }

  &_disabled {
    cursor: auto;

    .file-uploader__input {
      cursor: auto;
    }
  }
}
</style>
