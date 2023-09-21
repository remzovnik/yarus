<script lang="ts" setup>
import { ref } from "vue";
import useNotify from "@/modules/Main/components/toast/useNotify";

const notify = useNotify();

const props = defineProps<{
  id: string | number;
}>();
//todo вроде бы не используется, перепроверить и удалить.
const hiddenInput = ref();

const submitClickHandler = async (resolve, close): Promise<void> => {
  hiddenInput.value.type = "text";
  hiddenInput.value.value = getCode();
  hiddenInput.value.select();
  document.execCommand("copy");
  hiddenInput.value.type = "hidden";
  notify.message(true, "true", "Код скопирован");
  resolve();
  close();
};

const getCode = (): string => {
  return `<iframe  style="max-width: 100%; width: 824px; aspect-ratio: 1.75; border: none" src="https://yarus.ru/embed/${props.id}"></iframe>`;
};
</script>

<template>
  <BaseModal
    title="Скопировать код для вставки"
    submit-button-text="Копировать"
    :are-actions-shown="true"
    :submit-handler="submitClickHandler"
  >
    <template #content>
      <BaseTextarea :model-value="getCode()" :custom-height="160" label="Код для вставки:" read-only />
      <input ref="hiddenInput" type="hidden" />
    </template>
  </BaseModal>
</template>
