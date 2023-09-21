<script setup lang="ts">
import SearchTabs from "@/modules/Search/components/SearchTabs.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import Seo from "@/modules/Seo/components/Seo.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";

const props = withDefaults(
  defineProps<{
    isDisabled: boolean;
    isNotFoundShown: boolean;
    isQueryEmptyShown?: boolean;
  }>(),
  {
    isQueryEmptyShown: false,
  }
);
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>

    <template #content>
      <main class="search-page page">
        <div class="search-page__tabs">
          <SearchTabs :is-disabled="isDisabled" />
        </div>

        <NoContent v-if="isNotFoundShown" image="/images/no-results.svg" title="Упс...">
          Ничего не найдено, но у нас есть ещё много интересного
        </NoContent>
        <NoContent v-if="isQueryEmptyShown" image="/images/no-results.svg" title="Введите запрос">
          Чтобы мы смогли найти музыку, которая вам нравится
        </NoContent>

        <div class="search-page__result-items">
          <slot name="page" />
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.search-page {
  &__tabs {
    margin-bottom: 2.6rem;

    @media (max-width: $media-sm) {
      margin-bottom: 1.8rem;
    }
  }

  &__result-items {
    margin-top: 2.6rem;
    padding-bottom: 2rem;

    @media (max-width: $media-sm) {
      margin-top: 1.8rem;
    }
  }

  .music-content-section {
    max-width: 100%;
    margin-bottom: 0;
  }
}
</style>
