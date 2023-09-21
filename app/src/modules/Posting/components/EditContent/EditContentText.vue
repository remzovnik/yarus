<script lang="ts" setup>
import TextModel from "@/modules/Posting/models/TextModel";
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "update:modelValue", modelValue: TextModel): void;
}>();

const props = defineProps<{
  modelValue: TextModel | null;
}>();

const model = ref<TextModel>(props.modelValue ? props.modelValue : new TextModel());

watch(
  () => model.value,
  async (newValue) => {
    emit("update:modelValue", newValue);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div class="edit-content-text">
    <BaseTextarea v-model="model.text" :custom-height="22" placeholder="Добавьте текст" />
  </div>
</template>

<style lang="scss">
.edit-content-text {
  .common-input__field {
    @include body-18;

    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;

    &::placeholder {
      @include body-18;
    }

    @media (max-width: $media-md) {
      padding: 1.6rem;
    }
  }
}
</style>
