<script lang="ts" setup>
import { computed, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits<{
  (event: "update:modelValue", payload: number | void): void;
  (event: "blur"): void;
}>();

interface ListItem {
  id: number;
  name: string;
}

const props = defineProps<{
  modelValue?: number;
  list: ListItem[];
  placeholder?: string;
  label?: string;
  autocomplete?: boolean;
}>();

const selectValue = computed<string>(() => {
  return props.list.find((listItem) => listItem.id === props.modelValue)?.name || "";
});

const dropdown = ref(null);
const isShownDropdown = ref(false);
const autocompleteValue = ref(selectValue.value);

const arrowIcon = computed<string>(() => {
  return isShownDropdown.value ? "arrow-up" : "arrow-down";
});

const selectList = computed<ListItem[]>(() => {
  return props.list;
});

const autocompleteList = computed<ListItem[]>(() => {
  return props.list
    .filter((listItem) => listItem.name.toLowerCase().includes(autocompleteValue.value.toLowerCase()))
    .slice(0, 20);
});

const select = (id: number): void => {
  emit("update:modelValue", id);
  autocompleteValue.value = props.list.find((listItem) => listItem.id === id)?.name || "";
  isShownDropdown.value = false;
};

const blurHandler = (): void => {
  emit("blur");
};

const clickHandler = (): void => {
  if (props.autocomplete) return;
  isShownDropdown.value = !isShownDropdown.value;
};

const inputHandler = (event: string | number): void => {
  if (!props.autocomplete) return;
  autocompleteValue.value = String(event);
  emit("update:modelValue");
  isShownDropdown.value = true;
};

onClickOutside(dropdown, () => {
  isShownDropdown.value = false;
});
</script>

<template>
  <VDropdown v-model:shown="isShownDropdown" class="base-select" theme="dropdown" auto-size :triggers="[]" :auto-hide="false">
    <BaseInput
      :model-value="autocomplete ? autocompleteValue : selectValue"
      :icon="!autocomplete ? arrowIcon : ''"
      class="base-select__field"
      :placeholder="placeholder || ''"
      :label="label || ''"
      :readonly="!autocomplete"
      @blur="blurHandler"
      @click="clickHandler"
      @input="inputHandler"
    />
    <template #popper>
      <ul ref="dropdown" class="base-select__list">
        <template v-if="autocomplete ? autocompleteList.length : selectList.length">
          <BaseButton
            v-for="listItem in autocomplete ? autocompleteList : selectList"
            :key="listItem.id"
            type="list-item"
            size="large"
            @click="select(listItem.id)"
            >{{ listItem.name }}</BaseButton
          >
        </template>
        <span v-else-if="autocomplete" class="base-select__list-empty">Нет совпадений</span>
      </ul>
    </template>
  </VDropdown>
</template>

<style lang="scss">
.base-select {
  &__list {
    max-height: 25rem;
    padding: 8px;
    overflow-y: auto;

    @include custom-scrollbar;

    &-empty {
      display: inline-block;
      padding: 1.3rem 1rem;
      color: $gray-600;

      @include label-16;
    }
  }

  &.v-popper--shown {
    .common-input {
      .common-input__field {
        border-color: $gray-500;
      }
    }
  }
}
</style>
