<script lang="ts" setup>
import { computed, Ref, ref, watchEffect } from "vue";
import FeedModel from "@/modules/Feed/models/FeedModel";
import PickItem from "@/modules/Main/components/form/PickItem.vue";
import FeedCreate from "@/modules/Feed/components/FeedCreate.vue";
import { appConfig } from "@/appConfig";

const props = defineProps<{
  id: number;
  feedList: Ref<FeedModel[]>;
  feedLoaded: Ref<boolean>;
  intersectHandler: () => Promise<void>;
}>();

const feedCreate = ref<{ createFeed: () => void }>();

const activeId = ref<number>();
const isFeedCreateValid = ref<boolean>(true);

const isCreateFeedDisabled = computed<boolean>(() => {
  return props.feedList.value.length >= appConfig.maxFeedCreatedCount;
});

const selectFeed = async (resolve, close): Promise<void> => {
  if (activeId.value === 0) {
    await feedCreate.value?.createFeed();
  }
  resolve(activeId.value);
  close();
};

const pickType = (id: number): void => {
  activeId.value = id;
};

const pickNewFeed = (): void => {
  activeId.value = 0;
};

const init = async (): Promise<void> => {
  activeId.value = props.id;
};

const isPickDisabled = computed<boolean>(() => {
  if (activeId.value === 0) {
    return !isFeedCreateValid.value;
  }

  return false;
});

const buttonPickNewFeedClasses = computed<object>(() => {
  return {
    "pick-feed-modal__new-picker_active": activeId.value === 0,
  };
});

watchEffect(() => {
  if (isFeedCreateValid.value) {
    activeId.value = 0;
  }
});

init();
</script>

<template>
  <BaseModal
    modal-classes="pick-feed-modal"
    title="Выберите ленту для публикации"
    :are-actions-shown="true"
    submit-button-text="Выбрать"
    :submit-handler="selectFeed"
    :is-submit-disabled="isPickDisabled"
  >
    <template #content>
      <div class="pick-feed-modal__content">
        <div class="pick-feed-modal__feed-list">
          <PickItem
            v-for="item in feedList.value"
            :key="item.id"
            :image="item.image"
            :description="`${item.countSubscriber ? item.countSubscriber : 0} подписчиков`"
            :title="item.name"
            :value="item.id"
            :is-active="item.id === activeId"
            @on-select="pickType"
          />

          <BaseInfiniteScroll v-if="!feedLoaded.value" @on-intersect="intersectHandler" />
        </div>

        <h4 class="pick-feed-modal__subtitle">Или создайте новую ленту</h4>
        <p v-if="isCreateFeedDisabled" class="pick-feed-modal__new-picker-error">Создано максимальное количество лент</p>
        <FeedCreate ref="feedCreate" v-model="isFeedCreateValid" :is-disabled="isCreateFeedDisabled">
          <button
            class="pick-feed-modal__new-picker"
            :class="buttonPickNewFeedClasses"
            type="button"
            :invite-list="[]"
            @click="pickNewFeed"
          ></button
        ></FeedCreate>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.pick-feed-modal {
  max-height: 100vh;

  &__content {
    display: flex;
    flex-direction: column;
    overflow-y: clip;
  }

  &__feed-list {
    @include custom-scrollbar;

    max-height: 19rem;
    margin-right: -1.6rem;
    overflow-y: auto;
  }

  .base-pick-item {
    margin-right: 0;
  }

  &__subtitle {
    @include label-14;

    margin-top: 3.2rem;
    margin-bottom: 1.6rem;
    color: $gray-600;
  }

  &__new-picker {
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;
    margin-left: auto;
    border: 1px solid $gray-300;
    border-radius: 50%;
    transition: background-color $trs-back, border-width $trs-back;

    @media (max-width: $media-sm) {
      margin-left: 0;
    }

    &:hover {
      background: $gray-200;
    }

    &_active {
      border: 6px solid $blue-100;

      &:hover {
        background: none;
      }
    }

    &-error {
      margin-bottom: 1.6rem;

      @include body-14;

      color: $gray-500;
    }
  }

  .base-modal__wrapper {
    max-height: none;
  }

  .base-modal__content {
    padding-right: 1.6rem;
    overflow-y: clip;
  }
}
</style>
