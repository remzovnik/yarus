<script setup lang="ts">
const emit = defineEmits<{ (event: "create", payload: string): void }>();

const props = withDefaults(defineProps<{ placeholder: string }>(), { placeholder: "Введите текст" });

const createTag = (event) => {
  if (event.target.value.trim().length) {
    emit("create", event.target.value);
    event.target.value = "";
  }
};
</script>

<template>
  <input class="input-tag" type="text" :placeholder="placeholder" @change="createTag" />
</template>

<style lang="scss">
.input-tag {
  width: 14.7rem;
  height: 3.2rem;
  padding: 0.6rem 1rem;
  background-color: $gray-200;
  border: none;
  border-radius: $border-radius-md;

  &::placeholder {
    @include label-14;

    color: $gray-500;
  }
}
</style>
