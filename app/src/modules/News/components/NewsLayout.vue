<script lang="ts" setup>
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const props = withDefaults(defineProps<{ title?: string }>(), { title: "Новости" });

const pages: RouteModel[] = [
  { linkName: "Тренды", name: ERouteName.NEWS_TRENDS },
  { linkName: "Все новости", name: ERouteName.NEWS_ALL },
  { linkName: "Интересы", name: ERouteName.NEWS_INTERESTS },
];
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="news-page">
        <h1 class="page-title">{{ title }}</h1>
        <BaseTabs class="news-page__tabs" :pages="pages" />

        <slot name="page" />
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.news-page {
  padding-top: 2.4rem;

  &__tabs {
    margin: 1rem 0 4rem;

    @media (max-width: $media-lg) {
      width: 88.6rem;
    }

    @media (max-width: $media-md) {
      width: 100%;
    }

    @media (max-width: $media-sm) {
      margin: 1rem 0;
    }
  }
}
</style>
