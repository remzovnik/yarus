<script lang="ts" setup>
import Error from "@/modules/Main/components/Error.vue";
import SeoErrorServer from "@/modules/Seo/components/SeoErrorServer.vue";
</script>

<template>
  <SeoErrorServer />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <Error
        title="Упс... Что-то пошло не так!"
        description="Попробуйте зайти на страницу позже или перейдите на Главную"
        image="/images/500.svg"
        button-home
      />
    </template>
  </LayoutBase>
</template>
