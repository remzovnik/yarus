<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import MediaService from "@/modules/Main/apiServices/MediaService";
import YarusAvatarPicker from "@/modules/Yarus/components/YarusAvatarPicker.vue";
import InputTag from "@/modules/Main/components/form/InputTag.vue";
import { YarusApiService } from "@/modules/Yarus/YarusApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ImageModel } from "@/modules/Main/models/ImageModel";
import YarusIconModel from "@/modules/Yarus/models/YarusIconModel";
import YarusModel, { YarusErrorModel } from "@/modules/Yarus/models/YarusModel";
import { useYarusStore } from "@/modules/Yarus/stores/YarusStore";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(
  defineProps<{
    isSmall?: boolean;
  }>(),
  {
    isSmall: false,
  }
);

const emit = defineEmits<{
  (e: "create-disabled", payload: boolean): void;
}>();

const notify = useNotify();
const yarusStore = useYarusStore();

type YarusSourceType = {
  type: string;
  label: string;
  isChecked: boolean;
};

const isLoadingImage = ref(false);
const isImageValid = ref(true);
const uploadInput = ref<HTMLElement | null>();
const loadingImageDelay = ref(200);
const image = ref<ImageModel | string>();
const pickedAvatar = ref<YarusIconModel | "custom">("custom");
const iconList = ref<YarusIconModel[]>([]);
const editingData = ref<YarusModel>(new YarusModel());
const name = ref<string>("");
const tagList = ref<string[]>([]);
const isCreateYarusLoading = ref(false);

const sourceList = ref<YarusSourceType[]>([
  { type: "post", label: "Публикации", isChecked: true },
  { type: "news", label: "Новости", isChecked: true },
  { type: "video", label: "Видео", isChecked: true },
  { type: "photo_post", label: "Инсталента", isChecked: true },
]);

const currentImage = computed<ImageModel | string>(() => {
  if (pickedAvatar.value === "custom") {
    return image.value ? (image.value as ImageModel).original?.url || image.value : "/images/yarus-avatar.png";
  } else {
    return pickedAvatar.value.image;
  }
});

const classes = computed<StyleClasses>(() => {
  return {
    "yarus-create_small": props.isSmall,
  };
});

const fetchData = async (): Promise<void> => {
  iconList.value = await ServiceLocator.instance.getService(YarusApiService).getIconList();

  if (yarusStore.isEditing) {
    editingData.value = await ServiceLocator.instance.getService(YarusApiService).getYarus(yarusStore.id);

    if (editingData.value.image) {
      pickedAvatar.value = "custom";
      image.value = editingData.value.image;
    } else {
      pickedAvatar.value = editingData.value.icon;
    }

    name.value = editingData.value.name;
    tagList.value = [...editingData.value.query.map((item) => item.query)];
    sourceList.value.forEach((item) => (item.isChecked = editingData.value[item.type]));
  }
};

const uploadImage = async (event): Promise<void> => {
  const file = event.target.files[0];

  if (!file) return;

  if (!isImageValid.value) {
    isImageValid.value = true;
  }
  isLoadingImage.value = true;

  const supportedFormats = ["jpg", "jpeg", "png"];
  const extension = file.type.split("/")[1];

  if (supportedFormats.includes(extension)) {
    const response = await ServiceLocator.instance.getService(MediaService).uploadAndResizeImage(file);
    image.value = response.body;
  } else {
    isImageValid.value = false;
  }

  setTimeout(() => {
    isLoadingImage.value = false;
  }, loadingImageDelay.value);
};

const pickAvatar = (payload): void => {
  isImageValid.value = true;
  image.value = undefined;
  pickedAvatar.value = payload;
};

const addTag = (payload: string): void => {
  tagList.value.push(payload);
};

const removeTag = (index: number): void => {
  tagList.value.splice(index, 1);
};

const startUploadImage = (): void => {
  pickAvatar("custom");
  (uploadInput.value as HTMLElement).click();
};

const createYarus = async (): Promise<number | undefined> => {
  isCreateYarusLoading.value = true;

  const data = {
    data: {
      name: name.value,
      photo_post: sourceList.value.find((item) => item.type === "photo_post")?.isChecked,
      news: sourceList.value.find((item) => item.type === "news")?.isChecked,
      post: sourceList.value.find((item) => item.type === "post")?.isChecked,
      video: sourceList.value.find((item) => item.type === "video")?.isChecked,
      query: tagList.value.map((item) => {
        return { query: item, enable: true };
      }),
      image: pickedAvatar.value === "custom" ? currentImage.value : undefined,
      iconId: pickedAvatar.value !== "custom" ? pickedAvatar.value.id : undefined,
    },
  };

  const response: YarusModel | YarusErrorModel = yarusStore.isEditing
    ? await ServiceLocator.instance.getService(YarusApiService).editYarus(editingData.value.id, data)
    : await ServiceLocator.instance.getService(YarusApiService).createYarus(data);

  if ((response as YarusErrorModel).status === "fail") {
    isCreateYarusLoading.value = false;

    //TODO: В связи с особенностями текущего апи, текст для оповещения выбирается на основании response.body
    switch ((response as YarusErrorModel).body) {
      case "Maximum count yarus 40": {
        notify.message(
          true,
          "false",
          "Создано максимальное количество ЯRUSов. Чтобы добавить новый, нужно удалить или отредактировать текущие"
        );
        break;
      }

      case '{"query":["Maximum number of yarus queries 20"]}': {
        notify.message(true, "false", "Выбрано максимальное количество интересов");
        break;
      }

      default: {
        notify.message(true, "false", "Произошла ошибка");
      }
    }

    return;
  }

  isCreateYarusLoading.value = false;

  return (response as YarusModel).id;
};

watchEffect(() => {
  emit(
    "create-disabled",
    isLoadingImage.value || !name.value || !tagList.value.length || !sourceList.value.some((el) => el?.isChecked)
  );
});

defineExpose({ createYarus });

fetchData();
</script>

<template>
  <div class="yarus-create" :class="classes" @keyup.enter.stop>
    <div class="yarus-create__main">
      <label class="yarus-upload-avatar" :class="{ 'yarus-upload-avatar_loaded': image }">
        <input
          ref="uploadInput"
          class="yarus-upload-avatar__input"
          type="file"
          accept="image/png, image/jpeg"
          hidden
          :disabled="isLoadingImage"
          @change="uploadImage"
        />

        <template v-if="pickedAvatar === 'custom'">
          <BaseAvatar v-if="!currentImage" class="hide-mobile" :image="currentImage as string" :size="isSmall ? 60 : 72" />
          <BaseAvatar v-else class="hide-mobile" :image="currentImage as string" :size="isSmall ? 60 : 72" />

          <BaseAvatar v-if="!currentImage" class="only-mobile" :image="currentImage as string" :size="40" />
          <BaseAvatar v-else class="only-mobile" :image="currentImage as string" :size="40" />
        </template>

        <span v-if="isLoadingImage" class="yarus-upload-avatar__wrapper yarus-upload-avatar__wrapper_loading">
          <BaseIcon name="loader" />
        </span>

        <span v-if="!isImageValid" class="yarus-upload-avatar__wrapper yarus-upload-avatar__wrapper_refresh">
          <BaseIcon class="yarus-upload-avatar__refresh-icon" name="refresh-right" :size="24" />
        </span>
      </label>

      <span v-if="pickedAvatar !== 'custom'" class="yarus-create__icon-container">
        <BaseAvatar class="hide-mobile" :image="currentImage as string" :size="40" />
        <BaseAvatar class="only-mobile" :image="currentImage as string" :size="24" />
      </span>

      <input v-model="name" class="yarus-upload-avatar__input" type="text" placeholder="Введите название яруса" />

      <div v-if="!isImageValid" class="yarus-upload-avatar__image-error">Загрузите картинку формата JPG, PNG.</div>
    </div>

    <div class="yarus-create__avatar-picker-list">
      <YarusAvatarPicker
        :size="isSmall ? 40 : 48"
        class="yarus-create__avatar-picker-item"
        :is-checked="true"
        @click.stop.prevent="startUploadImage"
      />
      <YarusAvatarPicker
        v-for="item in iconList"
        :key="`icon-${item.id}`"
        :size="isSmall ? 40 : 48"
        class="yarus-create__avatar-picker-item"
        :icon="item"
        :is-checked="(pickedAvatar as YarusIconModel).id === item.id"
        @change="pickAvatar"
      />
    </div>

    <section class="yarus-create-tags">
      <h2 class="yarus-create-tags__title">Выбор интересов</h2>

      <div class="yarus-create-tags__list">
        <BaseTag
          v-for="(item, index) in tagList"
          :key="`tag-${index}`"
          class="yarus-create-tags__item"
          size="large"
          is-removable
          @remove="removeTag(index)"
          >{{ item }}</BaseTag
        >
        <InputTag class="yarus-create-tags__item" placeholder="Добавьте интерес" @create="addTag" />
      </div>
    </section>

    <section class="yarus-create-sources">
      <h2 class="yarus-create-sources__title">Выбор источников</h2>
      <div class="yarus-create-sources__list">
        <BaseCheckbox
          v-for="(item, index) in sourceList"
          :key="`source-${index}`"
          v-model:is-checked="item.isChecked"
          class="yarus-create-sources__item"
          >{{ item.label }}</BaseCheckbox
        >
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.yarus-create {
  &__main {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;
    padding-bottom: 4rem;
    border-bottom: 1px solid $gray-400;

    @media (max-width: $media-sm) {
      padding-bottom: 3.4rem;
    }
  }

  &__avatar-picker-list {
    display: flex;
    flex-wrap: wrap;
    margin: -0.8rem;

    @media (max-width: $media-sm) {
      margin: -0.8rem -1.1rem;
    }
  }

  &__avatar-picker-item {
    flex-shrink: 0;
    margin: 0.8rem;

    @media (max-width: $media-sm) {
      margin: 0.8rem 1.1rem;
    }
  }

  &__icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 7.2rem;
    height: 7.2rem;
    background-color: $gray-300;
    border-radius: 100%;

    @media (max-width: $media-sm) {
      width: 4rem;
      height: 4rem;
    }
  }

  &__create-mobile {
    width: 100%;
    margin-top: 3.2rem;
  }

  .yarus-upload-avatar {
    position: relative;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    background: $gray-300 url("/images/yarus-avatar.png") 50% 50% no-repeat / cover;
    cursor: pointer;

    &__input {
      @include label-16;

      flex-grow: 1;
      margin-left: 1.6rem;
      border: none;

      &:focus {
        outline: none;
      }

      @include placeholder {
        color: $gray-500;
      }
    }

    &__image-error {
      @include label-12;

      position: absolute;
      bottom: 0.8rem;
      left: 0;
      color: $red-100;
    }

    &__wrapper {
      position: absolute;
      inset: -1px;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $gray-200;
      border-radius: 100%;

      &_refresh {
        color: $red-100;
        border: 1px solid $red-100;
      }
    }
  }

  .yarus-create-tags {
    margin-top: 3.2rem;

    &__title {
      @include headline-18;

      margin-bottom: 1.6rem;
      color: $gray-600;
    }

    &__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: -0.4rem;
    }

    &__item {
      margin: 0.4rem;
    }
  }

  .yarus-create-sources {
    margin-top: 3.2rem;

    &__title {
      @include headline-18;

      margin-bottom: 1.6rem;
      color: $gray-600;
    }

    &__list {
      display: inline-flex;
      flex-direction: column;
    }

    &__item {
      @include body-14;

      color: $gray-600;

      &:not(:last-of-type) {
        margin-bottom: 1.2rem;
      }
    }
  }

  &_small {
    .yarus-create {
      &__main {
        padding-bottom: 1.6rem;
      }

      &__avatar-picker-list {
        margin: -0.6rem;

        @media (max-width: $media-sm) {
          margin: -0.6rem -1.1rem;
        }
      }

      &__avatar-picker-item {
        margin: 0.6rem;

        @media (max-width: $media-sm) {
          margin: 0.6rem 1.1rem;
        }
      }
    }

    .yarus-create-tags {
      margin-top: 2rem;

      &__title {
        @include label-16-bold;
      }
    }

    .yarus-create-sources {
      margin-top: 2rem;

      &__title {
        @include label-16-bold;
      }
    }
  }
}
</style>
