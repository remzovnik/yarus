<script lang="ts" setup>
import Error from "@/modules/Main/components/Error.vue";
import SeoAccessDenied from "@/modules/Seo/components/SeoAccessDenied.vue";
</script>

<template>
  <SeoAccessDenied />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <Error
        class="error-blocked-page"
        title="Нет доступа 😢"
        description="Для просмотра этого контента у вас недостаточно прав."
        image="/images/blocked.png"
        :is-home-button="false"
      />
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.error-blocked-page {
  img {
    width: 17rem;
    height: 14rem;

    @media (max-width: $media-sm) {
      width: 10.8rem;
      height: 8.9rem;
    }
  }
}
</style>
