<script lang="ts" setup>
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps<{ pages: RouteModel[]; classes?: string }>();

const isActive = (link: RouteModel): boolean => {
  return route.name === link.name;
};

const getRoute = (page: RouteModel): RouteModel => {
  return { name: page.name };
};
</script>

<template>
  <div class="base-tabs">
    <div class="base-tabs__wrapper">
      <router-link
        v-for="(page, index) in props.pages"
        :key="index"
        :to="getRoute(page)"
        class="base-tabs__item"
        :class="{ 'base-tabs__item_active': isActive(page) }"
      >
        {{ page.linkName }}
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.base-tabs {
  border-bottom: 1px solid $gray-300;

  &__wrapper {
    @include hide-scroll;

    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }

  &__item {
    @include label-16;

    position: relative;
    margin-right: 2.4rem;
    padding: 1.4rem 0;
    color: $gray-600;

    &_active,
    &.router-link-active {
      color: $blue-100;
      font-weight: 600;

      &::after {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: $blue-100;
        border-radius: 16px;
        transform: scaleX(1);
        transition: transform 0.15s ease-out;
        content: "";
      }
    }
  }
}
</style>
