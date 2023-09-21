<script lang="ts" setup>
import TitleModel from "@/modules/Posting/models/TitleModel";
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "update:modelValue", modelValue: TitleModel): void;
}>();

const props = defineProps<{
  modelValue: TitleModel | null;
}>();

const model = ref<TitleModel>(props.modelValue ? props.modelValue : new TitleModel());

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
  <div class="edit-content-title">
    <BaseTextarea v-model="model.text" :custom-height="66" placeholder="Добавьте заголовок" />
  </div>
</template>

<style lang="scss">
.edit-content-title {
  .common-input__field {
    @include headline-24;

    padding: 0;
    background-color: transparent;
    border: none;
    border-radius: 0;

    &::placeholder {
      @include headline-24;
    }

    @media (max-width: $media-md) {
      padding: 1.6rem;
    }
  }
}
</style>
