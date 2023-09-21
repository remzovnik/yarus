<script lang="ts" setup>
const props = defineProps<{ title: string; description?: string; submitHandler: () => void }>();
</script>

<template>
  <BaseModal
    :title="title"
    :description="description"
    :are-actions-shown="true"
    submit-button-text="Авторизоваться"
    :submit-handler="submitHandler"
  />
</template>
