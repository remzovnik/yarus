<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { EKeyCode } from "@/infrastructure/Keyboard/EKeyCode.enum";

const CELL_REGEXP = "^\\d{1}$";

const props = withDefaults(
  defineProps<{
    length?: number;
    value?: string;
    errorMessage?: string;
    hasError?: boolean;
    autofocus?: boolean;
    isDisabled: boolean;
  }>(),
  {
    length: 4,
    value: "",
    errorMessage: "",
    autofocus: true,
    hasError: false,
    isDisabled: false,
  }
);

const emit = defineEmits<{
  (event: "input", value: string): void;
  (event: "update:value", value: string): void;
  (event: "focus"): void;
}>();

const inputList = ref({});
const cells = ref<
  {
    key: number;
    value: string;
  }[]
>([]);
const currentCellIndex = ref(0);
const watchers = ref({});

const setCurrentCellIndex = (index: any = 0): void => {
  const el = inputList.value[`input-code__cell-${index}`];
  el.focus();
  el.select();
  currentCellIndex.value = index;
  emit("focus");
};

const isTheCellValid = (cell, allowEmpty = true): boolean => {
  if (!cell) {
    return allowEmpty ? cell === "" : false;
  }
  return !!cell.match(CELL_REGEXP);
};

const setPreviousCell = (): void => {
  if (!currentCellIndex.value) return;
  setCurrentCellIndex(currentCellIndex.value - 1);
};

const setNextCell = (): void => {
  if (currentCellIndex.value === props.length - 1) return;
  setCurrentCellIndex(currentCellIndex.value + 1);
};

const onCellChanged = (index: string | number, newVal: any): void => {
  if (!isTheCellValid(newVal, false)) {
    cells.value[index].value = "";
    return;
  }
  setNextCell();
};

const onCellErase = (index: string | number, event: Event): void => {
  const isThisCellFilled = cells.value[index].value.length;

  cells.value[index].value = "";

  if (!isThisCellFilled) {
    setPreviousCell();
    event.preventDefault();
  }
};

const keyDownHandler = (event: KeyboardEvent): void => {
  switch (event.key) {
    case EKeyCode.ARROW_LEFT:
      setPreviousCell();
      break;
    case EKeyCode.ARROW_RIGHT:
      setNextCell();
      break;
    default:
      break;
  }
};

const setCellWatcher = (index): void => {
  const watchingProperty = `cells.value.${index}.value`;

  watchers.value[watchingProperty] = watch(
    () => cells.value[index].value,
    (newVal) => onCellChanged(index, newVal)
  );
};

const onParentValueUpdated = (): void => {
  if (props.value.length !== props.length) {
    emit("input", calculatedCode.value);
    return;
  }

  props.value.split("").forEach((cell, idx) => {
    cells.value[idx].value = cell || "";
  });
};

const reset = (): void => {
  unwatchCells();
  init();
  setCurrentCellIndex();
};

const unwatchCells = (): void => {
  const watcherList = Object.keys(watchers.value);
  watcherList.forEach((name) => watchers.value[name]());
};

const init = (): void => {
  cells.value = [];
  for (let key = 0; key < props.length; key++) {
    cells.value.push({
      key,
      value: "",
    });
    setCellWatcher(key);
  }
};

const calculatedCode = computed<string>(() => {
  //@ts-ignore
  return cells.value.reduce((pin, cell) => pin + cell.value, "");
});

const classes = computed<StyleClasses>(() => {
  return {
    "base-input-code_error": props.hasError,
  };
});

watch(
  () => props.value,
  (newVal) => {
    if (newVal) {
      onParentValueUpdated();
    } else {
      reset();
    }
  }
);

watch(
  () => props.length,
  () => {
    reset();
  }
);

watch(
  () => calculatedCode.value,
  (newVal) => {
    emit("update:value", newVal);
  }
);

onMounted((): void => {
  init();
  onParentValueUpdated();

  if (props.autofocus) {
    nextTick(() => {
      setCurrentCellIndex();
    });
  }
});
</script>

<template>
  <div class="base-input-code" :class="classes">
    <div class="base-input-code__cells">
      <input
        v-for="(cell, index) in cells"
        :key="index"
        :ref="
          (el) => {
            return (inputList[`input-code__cell-${index}`] = el);
          }
        "
        v-model.trim="cell.value"
        :disabled="isDisabled"
        type="text"
        class="base-input-code__cell"
        pattern="\d*"
        inputmode="numeric"
        maxlength="1"
        @focus="setCurrentCellIndex(index)"
        @keydown.delete="onCellErase(index, $event)"
        @keydown="keyDownHandler"
      />
    </div>
    <div v-if="hasError" class="base-input-code__error">{{ errorMessage }}</div>
  </div>
</template>

<style lang="scss">
.base-input-code {
  position: relative;

  &__cells {
    display: flex;
    height: 8rem;

    @media (max-width: $media-sm) {
      height: 6.4rem;
    }
  }

  &__cell {
    @include headline-24;

    width: 8rem;
    height: 100%;
    color: $gray-600;
    text-align: center;
    border: 1px solid $gray-300;
    border-radius: 1.2rem;
    outline: none;
    transition: all 0.15s ease;
    appearance: none;
    appearance: textfield;
    caret-color: transparent !important;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      margin: 0;
      appearance: none;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-color: $gray-500;
      }
    }

    &:focus {
      border-color: $blue-100;
      border-width: 2px;
    }

    &:not(:first-child) {
      margin-left: 1.6rem;
    }

    @media (max-width: $media-sm) {
      width: 6.4rem;

      &:not(:first-child) {
        margin-left: 1rem;
      }
    }
  }

  &__error {
    @include label-12;

    padding: 0.8rem 0 0;
    color: $red-100;
  }

  &_error &__cell {
    border-color: $red-100;
  }
}
</style>
