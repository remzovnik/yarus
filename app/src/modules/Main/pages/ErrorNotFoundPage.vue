<script lang="ts" setup>
import Error from "@/modules/Main/components/Error.vue";
import SeoNotFound from "@/modules/Seo/components/SeoNotFound.vue";
</script>

<template>
  <SeoNotFound />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <Error
        title="Страница не найдена"
        description="Запрашиваемая вами страница не найдена, перемещена или удалена"
        image="/images/404.svg"
        button-home
      />
    </template>
  </LayoutBase>
</template>
