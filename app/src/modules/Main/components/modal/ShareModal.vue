<script lang="ts" setup>
import { computed, ref } from "vue";
import ShareTargetModel from "@/modules/Main/models/ShareTargetModel";
import ButtonTechnical from "@/modules/Main/components/buttons/ButtonTechnical.vue";
import copyStringToClipboard from "@/_core/utils/CopyStringToClipboard";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { useVideoStore } from "@/modules/Video/store/VideoStore";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { useUserStore } from "@/modules/User/stores/UserStore";

const COPY_BTN_ID = 7;

const notify = useNotify();
const videoStore = useVideoStore();
const userStore = useUserStore();

const props = defineProps<{
  type: EActionContentType;
  url: string;
}>();

const isWithTimeCode = ref<boolean>(false);

const shareCustomItem: ShareTargetModel = {
  id: COPY_BTN_ID,
  url: props.url,
  shareUserUrl: `${userStore.textForSharing}`,
  title: "Скопировать ссылку",
  icon: "link",
};

const shareList = computed<ShareTargetModel[]>(() => {
  const shareTargetArr: ShareTargetModel[] = [
    {
      id: 1,
      url: `https://vk.com/share.php?url=${props.url}`,
      shareUserUrl: `https://vk.com/share.php?url=${userStore.urlForSharing}`,
      title: "Поделиться во Вконтакте",
      icon: "vk",
    },
    {
      id: 2,
      url: `https://connect.ok.ru/offer?url=${props.url}`,
      shareUserUrl: `https://connect.ok.ru/offer?url=${userStore.urlForSharing}`,
      title: "Поделиться в Одноклассниках",
      icon: "ok",
    },
    {
      id: 3,
      url: `https://yandex.ru/chat?text=${props.url}#/forward`,
      shareUserUrl: `https://yandex.ru/chat?text=${userStore.textForSharing}${userStore.urlForSharing}#/forward`,
      title: "Поделиться в Яндекс",
      icon: "yandex",
    },
    {
      id: 4,
      url: `https://mail.google.com/mail/u/0/?fs=1&tf=cm&body=${props.url}`,
      shareUserUrl: `https://mail.google.com/mail/u/0/?fs=1&tf=cm&body=${userStore.textForSharing}${userStore.urlForSharing}`,
      title: "Поделиться в Gmail",
      icon: "google",
    },
    {
      id: 5,
      url: `https://t.me/share/url?url=${props.url}`,
      shareUserUrl: `https://t.me/share/url?url=${userStore.urlForSharing}&text=${userStore.textForSharing}`,
      title: "Поделиться в Telegram",
      icon: "telegram",
    },
    {
      id: 6,
      url: `https://api.whatsapp.com/send?text=${props.url}`,
      shareUserUrl: `https://api.whatsapp.com/send?text=${userStore.textForSharing}${userStore.urlForSharing}`,
      title: "Поделиться в Whatsapp",
      icon: "whatsapp",
    },
  ];

  if (props.type !== EActionContentType.VIDEO) {
    shareTargetArr.push(shareCustomItem);
  }

  return shareTargetArr;
});

const copyToClipboardHandler = async (item: ShareTargetModel): Promise<void> => {
  try {
    const resultString =
      props.type === EActionContentType.USER && item.shareUserUrl ? `${item.shareUserUrl}${userStore.urlForSharing}` : item.url;
    await copyStringToClipboard(resultString);
    notify.message(true, "true", "Ссылка успешно скопирована");
  } catch {
    notify.message(true, "true", "Ошибка копирования");
  }
};
const itemTargetClickHandler = (item: ShareTargetModel): void => {
  if (item.id === COPY_BTN_ID) {
    const url = new URL(item.url);
    if (isWithTimeCode.value) {
      url.searchParams.set("t", String(videoStore.currentTime));
    } else {
      url.searchParams.delete("t");
    }

    item.url = url.href;
    copyToClipboardHandler(item);
  } else {
    if (props.type === EActionContentType.USER && item.shareUserUrl) {
      item.url = item.id === COPY_BTN_ID ? item.shareUserUrl : encodeURI(item.shareUserUrl);
    }
    window.open(item.url, "_blank")?.focus();
  }
};

const classes = computed<StyleClasses>(() => {
  return {
    [`share-modal_type_${props.type}`]: !!props.type,
  };
});

const currentCroppedUrl = computed<string>(() => {
  const url = new URL(props.url);
  url.searchParams.delete("t");
  return url.href;
});
</script>

<template>
  <BaseModal
    title="Поделиться в соц.сетях"
    description="Расскажите своим друзьям об этом."
    submit-button-text="Авторизоваться"
    :are-actions-shown="false"
  >
    <template #content>
      <div class="share-modal" :class="classes">
        <div class="share-modal__list">
          <ButtonTechnical
            v-for="(item, index) in shareList"
            :key="index"
            class="share-modal__button hide-mobile"
            type="secondary"
            :icon="item.icon"
            size="large"
            :aria-label="item.title"
            @click="itemTargetClickHandler(item)"
          />
          <BaseButton
            v-for="(item, index) in shareList"
            :key="index"
            class="share-modal__button only-mobile"
            type="secondary"
            :icon="item.icon"
            size="small"
            :aria-label="item.title"
            @click="itemTargetClickHandler(item)"
          />
        </div>

        <div v-if="type === EActionContentType.VIDEO" class="share-modal__video">
          <BaseInput
            :model-value="currentCroppedUrl"
            type="share"
            size="medium"
            readonly
            @click="itemTargetClickHandler(shareCustomItem)"
          />
          <BaseCheckbox v-model:isChecked="isWithTimeCode" :size="24" class="share-modal__checkbox"
            ><span class="share-modal__checkbox-text">Скопировать ссылку с привязкой ко времени</span></BaseCheckbox
          >
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.share-modal {
  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-right: -1.6rem;
  }

  &__button {
    margin: 0 1.6rem 1.6rem 0;
  }

  &__video {
    margin-top: 1.8rem;
    padding-top: 1.8rem;
    border-top: 1px solid $gray-300;

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
    }
  }

  &__checkbox {
    margin-top: 1.2rem;
  }

  &__checkbox-text {
    @include body-18;

    @media (max-width: $media-sm) {
      @include body-14;
    }
  }

  &_type {
    &_video {
      .share-modal {
        &__list {
          margin-right: -0.3rem;
        }

        &__button {
          margin: 0 0.3rem 0.3rem 0;
        }
      }
    }
  }
}
</style>
