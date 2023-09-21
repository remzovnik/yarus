<script setup lang="ts">
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const tabPages: RouteModel[] = [
  { linkName: "Все", name: ERouteName.VIDEO_ALL },
  { linkName: "Подборки", name: ERouteName.VIDEO_COLLECTION_LIST },
];
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <h1 class="video-page__title page-title">Видео</h1>
      <BaseTabs class="video-page__tabs" :pages="tabPages" />
      <slot name="page" />
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.video-page {
  &__title {
    margin-bottom: 2.4rem;
  }

  &__tabs {
    margin-bottom: 2.4rem;
  }
}
</style>
