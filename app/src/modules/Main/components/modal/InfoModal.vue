<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title: string;
    text?: string;
  }>(),
  {
    text: "",
  }
);
</script>

<template>
  <BaseModal :title="title" modal-classes="info-modal">
    <template #content>
      {{ text }}
    </template>
  </BaseModal>
</template>

<style lang="scss">
.info-modal {
  .base-modal__content {
    @include body-16;

    margin-top: 2.4rem;
  }
}
</style>
