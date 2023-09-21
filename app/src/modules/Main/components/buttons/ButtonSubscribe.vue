<script setup lang="ts">
import { computed, ref, inject } from "vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import useModal from "@/modules/Main/components/modal/useModal";
import { BaseButtonType } from "@/modules/Main/models/BaseButtonType";
import { eventsConfig } from "@/appConfig";
import { EFeedSubscribeStatus } from "@/domain/Feed/EFeedSubscribeStatus.enum";
import { TFeedSubscribeStatus } from "@/domain/Feed/Feed.types";
import { ISubscribeResponse } from "@/modules/Subscribe/Subscribe.api-service/SubscribeApiAervice.interface";
import { SubscribeService } from "@/modules/Subscribe/service/Subscribe.service";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import { Id } from "@/_core/Base.type";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EApiErrorStatus } from "@/infrastructure/api/EApiErrorStatus.enum";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";

const authStore = useAuthStore();
const modal = useModal();
const emitter: any = inject("emitter");
const notify = useNotify();

type ButtonSize = "large" | "medium" | "small";

const props = withDefaults(
  defineProps<{
    id: Id | string; // hashtag в качестве id использует name
    type: ESubscribeType;
    size?: ButtonSize;
    isAlwaysSecondary?: boolean;
    isMobileImmutable?: boolean;
    isTabletImmutable?: boolean;
    isDisabled?: boolean;
    isSubscribed: boolean;
    subscribeStatus?: TFeedSubscribeStatus;
    isPrivateContent?: boolean;
  }>(),
  {
    size: "medium",
    isSubscribed: false,
    isAlwaysSecondary: false,
    isMobileImmutable: false,
    isTabletImmutable: false,
  }
);

const isSubscribeWaiting = ref<boolean>(false);
const subscribeStatus = ref<TFeedSubscribeStatus>(props.subscribeStatus || null);
const isSubscribed = ref<boolean>(props.isSubscribed || subscribeStatus.value === EFeedSubscribeStatus.REQUESTED);

const btnText = computed<string>(() => {
  if (subscribeStatus.value === EFeedSubscribeStatus.REQUESTED) {
    return "Отменить запрос";
  }

  if (isSubscribed.value) {
    return "Отписаться";
  } else {
    if (props.isPrivateContent) {
      return "Отправить запрос";
    }

    if (props.type === "event") {
      return "Участвовать";
    }

    return "Подписаться";
  }
});

const btnType = computed<BaseButtonType>(() => {
  if (props.isAlwaysSecondary || subscribeStatus.value === EFeedSubscribeStatus.REQUESTED) {
    return "secondary";
  }

  return isSubscribed.value ? "secondary" : "primary";
});

const showInfoModal = async () => {
  await modal.showInfoModal({
    title: "Подписка заблокирована",
    text: "Подписка на пользователей временно недоступна. Вы можете обратиться в поддержку",
    cancelButtonText: "Написать в поддержку",
    submitButtonText: "Понятно",
    areActionsShown: true,
    submitHandler: (resolve, close) => {
      resolve();
      close();
    },
    cancelHandler: (resolve, close) => {
      resolve();
      close();
      modal.showFeedbackModal();
    },
  });
};

const subscribe = async (type: ESubscribeType, id: Id | string): Promise<ISubscribeResponse> => {
  const result = await SubscribeService.getApiService(type).subscribe(id);
  if (result.status === EApiErrorStatus.OK) {
    if (!props.isPrivateContent) {
      emitter.emit(eventsConfig.subscriptionsCount, 1);
    } else {
      subscribeStatus.value = EFeedSubscribeStatus.REQUESTED;
    }
  } else {
    if (result.errors) {
      notify.message(true, "false", result.errors[0].errorText);
    } else if (result.result) {
      notify.message(true, "false", result.result);
    }
    await ServiceLocator.instance.getService(AuthApiService).setCurrentUser();
  }
  return result;
};

const unSubscribe = async (type: ESubscribeType, id: Id | string): Promise<ISubscribeResponse> => {
  const result = await SubscribeService.getApiService(type).unSubscribe(id);
  if (!props.isPrivateContent) {
    emitter.emit(eventsConfig.subscriptionsCount, -1);
  } else {
    subscribeStatus.value = null;
  }
  return result;
};

const subscribeHandler = async (): Promise<void> => {
  if (isSubscribeWaiting.value) {
    return;
  }

  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  if (!isSubscribed.value && authStore.sessionUser?.isSocialBanSubscriptions) {
    await showInfoModal();
    return;
  }

  isSubscribeWaiting.value = true;

  if (isSubscribed.value) {
    if (props.type === ESubscribeType.FEED && !props.isPrivateContent) {
      const modalProps = {
        title: "Вы уверены, что хотите отписаться от ленты?",
        submitButtonText: "Отписаться",
        submitHandler: async (resolve, close) => {
          await unSubscribe(props.type, props.id);

          isSubscribed.value = false;

          resolve();
          close();
        },
      };

      await modal.showConfirmModal(modalProps);
    } else {
      await unSubscribe(props.type, props.id);
      isSubscribed.value = false;
    }
  } else {
    await subscribe(props.type, props.id);
    isSubscribed.value = true;
  }

  isSubscribeWaiting.value = false;
};
</script>

<template>
  <div v-if="!authStore.isMyAccount(id)" class="button-subscribe">
    <BaseButton
      :class="[isTabletImmutable ? '' : 'hide-only-tablet-flex', isMobileImmutable ? '' : 'hide-mobile']"
      :type="btnType"
      :size="props.size"
      :is-loading="isSubscribeWaiting"
      :is-disabled="isDisabled"
      @click="subscribeHandler"
    >
      {{ btnText }}
    </BaseButton>

    <BaseButton
      :class="[
        isTabletImmutable ? 'hide' : 'only-tablet-flex',
        isMobileImmutable ? 'hide' : 'only-mobile-flex',
        isTabletImmutable && isMobileImmutable ? 'hide' : '',
      ]"
      :icon="isSubscribed ? 'check' : 'plus'"
      :size="'small'"
      :is-disabled="isDisabled"
      :type="btnType"
      :is-loading="isSubscribeWaiting"
      is-only-icon
      @click="subscribeHandler"
    >
    </BaseButton>
  </div>
</template>
