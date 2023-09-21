<script lang="ts" setup></script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="clips-page">
        <h1 class="clips-page__title page-title">Сюжеты</h1>

        <slot name="page" />
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.clips-page {
  &__title {
    margin-bottom: 2.4rem;
  }
}
</style>
