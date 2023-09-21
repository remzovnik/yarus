<script lang="ts" setup>
import EmotionListModel from "@/modules/Main/models/EmotionListModel";
import EmotionIcon from "../EmotionIcon.vue";
import PostModel from "@/modules/Post/models/PostModel";
import VideoModel from "@/modules/Video/models/VideoModel";
import { computed } from "vue";
import { kFormatter } from "@/_core/utils/Formaters";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const props = defineProps<{
  title: string;
  description?: string;
  model: PostModel | VideoModel;
  list: EmotionListModel;
  total: number;
  intersectHandler: () => void;
}>();

const userEmotion = computed<number>(() => {
  return props.model?.metricsFull?.emotions?.userEmotion;
});

const activeEmotion = (emotionId: number) => {
  return { active: userEmotion.value === emotionId };
};

const profileRoute = (userId: number): RouteModel => {
  return {
    name: ERouteName.USER,
    params: { id: userId },
  };
};
</script>

<template>
  <BaseModal :title="title" :are-actions-shown="false">
    <template #description>
      <div class="reaction-list-modal-metrics">
        <div
          v-for="(metric, index) in list.metrics"
          :key="index"
          class="reaction-list-modal-metrics__emotion"
          :class="activeEmotion(metric.emotionId)"
        >
          <EmotionIcon :id="metric.emotionId" class="reaction-list-modal-metrics__icon" :size="28" />
          <p class="reaction-list-modal-metrics__total">{{ kFormatter(metric.total) }}</p>
        </div>
      </div>
    </template>

    <template #content>
      <div class="reaction-list-modal-members">
        <router-link
          v-for="member in list.members"
          :key="member?.user?.id"
          :to="profileRoute(member?.user?.id)"
          class="reaction-list-modal-members__item"
        >
          <BaseAvatar class="reaction-list-modal-members__item-avatar" :image="member?.user?.photo" :size="40" is-outlined />
          <div class="reaction-list-modal-members__item-author">
            <p class="reaction-list-modal-members__item-name">
              <span class="reaction-list-modal-members__item-name-text"
                >{{ member?.user?.name }} {{ member?.user?.surname }}</span
              >
              <BaseIcon
                v-if="member?.user?.approved"
                class="reaction-list-modal-members__item-name-icon"
                name="verify"
                :size="14"
              />
            </p>
            <p class="reaction-list-modal-members__item-nickname">{{ member?.user?.nickname }}</p>
          </div>
          <EmotionIcon :id="member?.emotion" class="reaction-list-modal-members__item-emotion" :size="28" />
        </router-link>

        <BaseInfiniteScroll v-if="total !== list.members.length" @on-intersect="intersectHandler" />
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.reaction-list-modal-metrics {
  display: grid;
  grid-column-gap: 3.2rem;
  grid-template-columns: repeat(5, max-content);

  &__emotion {
    display: flex;
    flex-direction: column;
    align-items: center;

    &.active {
      .reaction-list-modal-metrics__icon {
        background: $blue-100;
      }

      .reaction-list-modal-metrics__total {
        color: $blue-100;
      }
    }
  }

  &__icon {
    padding: 0.5rem;
    background: $gray-200;
    border-radius: 100%;
  }

  &__total {
    margin-top: 0.2rem;
    color: $gray-500;

    @include body-14;
  }
}

.reaction-list-modal-members {
  height: 32.6rem;

  &__item {
    display: grid;
    grid-column-gap: 0.8rem;
    grid-template-columns: max-content 1fr max-content;
    align-items: center;
    padding: 1.6rem 0;
    border-bottom: 1px solid $gray-400;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__item-name {
    display: grid;
    grid-template-columns: 1fr max-content;

    @include label-16;

    color: $gray-600;
  }

  &__item-name-text {
    @include overflow-ellipsis;
  }

  &__item-nickname {
    @include body-14;

    color: $gray-500;
  }
}
</style>
