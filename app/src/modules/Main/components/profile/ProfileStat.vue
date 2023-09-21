<script setup lang="ts">
import { kFormatter } from "@/_core/utils/Formaters";
import RouteModel from "@/modules/Main/models/RouteModel";
import { inject, ref, onBeforeUnmount, computed } from "vue";
import { eventsConfig } from "@/appConfig";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type StatIdType = "views" | "subscribers" | "subscriptions";

const emitter: any = inject("emitter");

const props = defineProps<{
  id: StatIdType;
  icon: string;
  title: string;
  isActive: boolean;
  count: number;
  isMyAccount: boolean;
  route?: RouteModel;
  isPrivateContent?: boolean;
  isSubscribe?: boolean;
  hasAlert: boolean;
}>();

const currentCount = ref(props.count);

const isRouteDisabled = computed<boolean>(() => {
  return !!props.isPrivateContent && !props.isMyAccount && !props.isSubscribe;
});

const classes = computed<StyleClasses>(() => {
  return {
    "profile-stat_active": props.isActive,
    "profile-stat_alert": props.hasAlert,
  };
});

const subscriptionsCountChangeHandler = (value): void => {
  if (props.id === "subscriptions" && props.isMyAccount) {
    currentCount.value += value;
  }
};

emitter.on(eventsConfig.subscriptionsCount, subscriptionsCountChangeHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.subscriptionsCount, subscriptionsCountChangeHandler);
});
</script>

<template>
  <component :is="route && !isRouteDisabled ? 'router-link' : 'div'" :to="route" class="profile-stat" :class="classes">
    <div class="profile-stat__header">
      <BaseIcon :name="icon" />
      <div class="profile-stat__title">{{ title }}</div>
    </div>
    <div class="profile-stat__count" :class="{ 'profile-stat__count_active': isActive }">
      {{ kFormatter(currentCount) }}
    </div>
  </component>
</template>

<style lang="scss">
.profile-stat {
  position: relative;
  display: flex;
  align-items: center;
  height: 2rem;
  margin: 0 1.2rem;

  @media (max-width: $media-sm) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.6rem;
  }

  &__header {
    display: flex;
    align-items: center;
  }

  &__title {
    @include body-14;

    margin-left: 0.8rem;
  }

  &__count {
    @include headline-18;

    margin-left: 0.8rem;
    color: $gray-600;

    @media (max-width: $media-sm) {
      margin-left: 0;
    }
  }

  &.router-link-exact-active,
  &_active {
    color: $blue-100;

    &::before {
      position: absolute;
      bottom: -1.4rem;
      left: 0;
      width: 100%;
      height: 0.1rem;
      background-color: $blue-100;
      content: "";

      @media (max-width: $media-sm) {
        bottom: -3.1rem;
      }
    }

    .profile-stat__count {
      color: $blue-100;
    }
  }

  &_alert {
    &::after {
      position: absolute;
      top: 0;
      right: -1.2rem;
      width: 0.8rem;
      height: 0.8rem;
      background-color: $blue-100;
      border-radius: 100%;
      content: "";
    }
  }
}
</style>
