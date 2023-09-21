<script lang="ts" setup>
import { computed } from "vue";
import UserStatsModel from "@/modules/User/models/UserStatsModel";

const props = defineProps<{
  title: string;
  stats: UserStatsModel;
}>();

const normalizedStats = computed(() => {
  return [
    {
      title: "Ленты",
      icon: "feed",
      count: props.stats.feed,
    },
    {
      title: "Видео",
      icon: "video",
      count: props.stats.video,
    },
    {
      title: "Посты",
      icon: "post",
      count: props.stats.simplePost,
    },
    {
      title: "Cобытия",
      icon: "event",
      count: props.stats.event,
    },
    {
      title: "Фото",
      icon: "photo",
      count: props.stats.photoPost,
    },
    {
      title: "Клипы",
      icon: "clip",
      count: props.stats.clip,
    },
  ];
});
</script>

<template>
  <BaseModal :title="title" modal-classes="info-modal">
    <template #content>
      <div v-for="(item, index) in normalizedStats" :key="index" class="user-stats-modal__row">
        <BaseIcon class="user-stats-modal__icon" :name="item.icon" />
        <div class="user-stats-modal__title">{{ item.title }}</div>
        <div class="user-stats-modal__line"></div>
        <div class="user-stats-modal__count">{{ item.count }}</div>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.user-stats-modal {
  &__row {
    display: flex;
    align-items: center;

    &:not(:last-of-type) {
      margin-bottom: 1.6rem;
    }
  }

  &__icon {
    margin-right: 0.6rem;
  }

  &__title {
    @include body-16;

    margin-right: 0.8rem;
    color: $gray-600;
  }

  &__line {
    flex-grow: 1;
    align-self: flex-end;
    border-bottom: 1px solid $gray-400;
  }

  &__count {
    @include headline-16;

    margin-left: 0.8rem;
    color: $gray-600;
  }
}
</style>
