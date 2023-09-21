<script lang="ts" setup>
import { ref, computed } from "vue";
import { MainFeedFilter } from "@/domain/MainFeed/MainFeedFilter";
import MainFeedFilterSettings from "@/modules/MainFeed/components/MainFeedFilterSettings.vue";
import YarusCreate from "@/modules/Yarus/components/YarusCreate.vue";

const props = defineProps<{
  filter: MainFeedFilter;
  submitHandler: (filter: MainFeedFilter, resolve: () => void, close: () => void) => void;
}>();

const currentFilter = ref<MainFeedFilter>(props.filter);
const isCreateYarusActive = ref<boolean>(false);
const isCreateYarusDisabled = ref<boolean>(false);
const wasFilterChanged = ref<boolean>(false);

const yarusCreate = ref<{ createYarus: () => number }>();

const modalTitle = computed<string>(() => {
  return isCreateYarusActive.value ? "Создать ярус" : "Настройка главной ленты";
});

const submitBtnText = computed<string>(() => {
  return isCreateYarusActive.value ? "Создать" : "Сохранить";
});

const cancelBtnText = computed<string>(() => {
  return isCreateYarusActive.value ? "Назад" : "Отмена";
});

const isSubmitDisabled = computed<boolean>(() => {
  return isCreateYarusActive.value ? isCreateYarusDisabled.value : !wasFilterChanged.value || !currentFilter.value.isReadyForSave;
});

const submitAction = async (resolve, close): Promise<void> => {
  if (isCreateYarusActive.value) {
    await yarusCreate.value?.createYarus();
    isCreateYarusActive.value = false;
  } else {
    props.submitHandler(currentFilter.value, resolve, close);
  }
};

const cancelAction = async (resolve, close): Promise<void> => {
  if (isCreateYarusActive.value) {
    isCreateYarusActive.value = false;
  } else {
    close();
  }
};

const updateFilter = (newFilter: MainFeedFilter): void => {
  currentFilter.value = newFilter;
};

const changeCreateYarusState = (newState: boolean): void => {
  isCreateYarusDisabled.value = newState;
};

const enableSave = (): void => {
  wasFilterChanged.value = true;
};
</script>

<template>
  <BaseModal
    :title="modalTitle"
    modal-classes="base-modal_type_main-feed"
    are-actions-shown
    :submit-button-text="submitBtnText"
    :cancel-button-text="cancelBtnText"
    :submit-handler="submitAction"
    :cancel-handler="cancelAction"
    :is-submit-disabled="isSubmitDisabled"
  >
    <template #content>
      <MainFeedFilterSettings
        v-if="!isCreateYarusActive"
        :filter="filter"
        @update-filter="updateFilter"
        @init-create-yarus="isCreateYarusActive = true"
        @was-changed="enableSave"
      />
      <YarusCreate v-else ref="yarusCreate" is-small @create-disabled="changeCreateYarusState" />
    </template>
  </BaseModal>
</template>
