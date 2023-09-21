<script setup lang="ts">
import Header from "@/modules/Main/components/layouts/LayoutHeader.vue";
import { computed } from "vue";
import { useStore } from "@/modules/Main/stores/MainStore";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import AppInfoBanner from "@/modules/Main/components/AppInfoBanner.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";

const mainStore = useStore();
const authStore = useAuthStore();
const route = useRoute();

const props = withDefaults(defineProps<{ type?: ELayoutSidebarType }>(), {
  type: ELayoutSidebarType.DEFAULT,
});

const isAppInfoShown = computed<boolean>(() => {
  return mainStore.isBannerShown;
});
</script>

<template>
  <div class="container">
    <div v-if="isAppInfoShown" class="base-layout__banners">
      <AppInfoBanner />
    </div>
    <div class="base-layout">
      <div class="base-layout__leftside">
        <slot name="sidebar" />
      </div>

      <div class="base-layout__rightside">
        <slot name="header">
          <Header :type="type" />
        </slot>

        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.base-layout {
  display: flex;
  flex-grow: 1;

  &__banners {
    width: auto;

    @media (max-width: $media-sm) {
      width: 100vw;
    }
  }

  &__leftside {
    position: sticky;
    top: 0;
    z-index: 3;
    flex-shrink: 0;
    width: 18rem;
    height: 100vh;

    @media (max-width: $media-md) {
      width: 9.6rem;
    }

    @media (max-width: $media-sm) {
      display: none;
    }
  }

  &__rightside {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 112.8rem;
    margin-bottom: 3.2rem;
    margin-left: 3.2rem;

    @media (max-width: $media-lg) {
      width: 89.6rem;
      margin-left: 2.4rem;
    }

    @media (max-width: $media-md) {
      width: 56.1rem;
      margin-left: 3.2rem;
    }

    @media (max-width: $media-sm) {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
