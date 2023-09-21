<script lang="ts" setup>
import { fromUTC, toUNIXinMilliseconds, toUNIXinSeconds, toUTC, updateTime } from "@/_core/utils/DateUtils";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { computed, ref, useAttrs, useSlots } from "vue";
import DatepickerMonthYear from "@/modules/Main/components/datepicker/DatepickerMonthYear.vue";
import DateRangeModel from "@/modules/Main/models/DateRangeModel";

const attrs = useAttrs();
const slots = useSlots();

const emit = defineEmits<{
  (event: "update:modelValue", value: { start: number | null; end: number | null } | number | null): void;
  (event: "clear-value"): void;
  (event: "select-date"): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue: { start: number | null; end: number | null } | number | null;
    isRange?: boolean;
    isFuture?: boolean;
    isInline?: boolean;
  }>(),
  {
    isRange: false,
    isFuture: true,
    isInline: false,
  }
);

const datepicker = ref<{ selectDate: () => void; clearValue: () => void; closeMenu: () => void; openMenu: () => void }>();
const isOpened = ref(false);

const toDatepickerRangeFormat = (value: DateRangeModel): Date[] | null => {
  if (!value.start) return null;

  const response: Date[] = [];
  response.push(new Date(fromUTC(value.start)));
  response.push(new Date(fromUTC(toUNIXinSeconds(updateTime(toUNIXinMilliseconds(value.start), "235959")))));
  if (value.end) {
    response.splice(1, 1, new Date(fromUTC(value.end)));
  }
  return response;
};

const fromDatepickerRangeFormat = (value: Date[] | Date): DateRangeModel => {
  if (typeof value === "object") {
    return {
      start: toUTC(updateTime(value[0], "000000")),
      end: toUTC(updateTime(value[1], "235959")),
    };
  } else {
    return {
      start: toUTC(updateTime(value, "000000")),
      end: toUTC(updateTime(value, "235959")),
    };
  }
};

const toDatepickerSingleFormat = (value: number): Date => {
  return new Date(fromUTC(value));
};

const fromDatepickerSingleFormat = (value: Date): number => {
  return toUTC(updateTime(value, "000000"));
};

const value = computed({
  get(): Date | Date[] | null {
    if (!props.modelValue) return null;
    if (props.isRange) {
      return toDatepickerRangeFormat(props.modelValue as DateRangeModel);
    } else {
      return toDatepickerSingleFormat(props.modelValue as number);
    }
  },
  set(newValue: Date | Date[] | null): void {
    let value;
    if (props.isRange) {
      if (!newValue) value = { start: null, end: null };
      else value = fromDatepickerRangeFormat(newValue as Date[] | Date);
    } else {
      if (!newValue) value = null;
      else value = fromDatepickerSingleFormat(newValue as Date);
    }
    emit("update:modelValue", value);
  },
});

const defaultOptions = {
  menuClassName: "datepicker",
  partialRange: props.isRange,
  range: props.isRange,
  utc: true,
  enableTimePicker: false,
  minDate: props.isFuture ? new Date() : undefined,
  maxDate: props.isFuture ? undefined : new Date(),
  locale: "ru",
  monthYearComponent: DatepickerMonthYear,
  monthNameFormat: "long",
  position: "left",
  modelAuto: true,
  textInput: !!slots["db-input"],
  textInputOptions: {
    openMenu: !!slots["db-input"] ? false : true,
  },
};

const selectDate = (): void => {
  datepicker.value?.selectDate();
  emit("select-date");
};

const clearValue = (): void => {
  datepicker.value?.clearValue();
  emit("clear-value");
  emit("select-date");
};

const focusInputHandler = (): void => {
  if (isOpened.value) {
    hideMenu();
  }
};

const toggleMenu = (): void => {
  if (isOpened.value) {
    hideMenu();
  } else {
    openMenu();
  }
};

const openMenu = (): void => {
  datepicker.value?.openMenu();
};

const hideMenu = (): void => {
  datepicker.value?.closeMenu();
};
</script>

<template>
  <Datepicker
    ref="datepicker"
    v-model="value"
    :inline="isInline"
    v-bind="{ ...defaultOptions, ...attrs } as any"
    @open="isOpened = true"
    @closed="isOpened = false"
  >
    <template v-if="slots.trigger" #trigger>
      <slot name="trigger"></slot>
    </template>

    <template v-if="slots['db-input']" #dp-input>
      <slot name="db-input" :events="{ click: toggleMenu, focus: focusInputHandler }"></slot>
    </template>

    <template #action-select>
      <BaseButton type="secondary" @click="clearValue">Очистить</BaseButton>
      <BaseButton @click="selectDate">Сохранить</BaseButton>
    </template>
  </Datepicker>
</template>

<style lang="scss">
@mixin highlight {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: $blue-100-15;
    content: "";
    @content;
  }
}

@mixin active {
  color: $white-100;
  background: transparent;

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    width: 3.2rem;
    height: 3.2rem;
    background: $blue-100;
    border-radius: 100%;
    transform: translate(-50%, -50%);
    content: "";
  }
}

.datepicker {
  font-family: $font-family;
  border: none !important;
  border-radius: $border-radius-md;
  box-shadow: $box-shadow-deep;

  .datepicker-month-year {
    padding: 0 0.8rem;

    @media (max-width: $media-sm) {
      padding: 0 0.3rem;
    }
  }

  .dp {
    &__arrow_top,
    &__arrow_bottom,
    &__selection_preview {
      display: none;
    }

    &__action_row {
      padding: 1.2rem 1.6rem;
      border-radius: 0 0 $border-radius-md $border-radius-md;
      box-shadow: $box-shadow-deep;

      @media (max-width: $media-sm) {
        padding: 2.4rem 1.6rem;
        box-shadow: none;
      }
    }

    &__action_buttons {
      display: flex;
      width: 100%;

      @media (max-width: $media-sm) {
        flex-direction: column;
      }

      & > .base-button {
        flex-grow: 1;

        &:first-child {
          margin-right: 1.2rem;

          @media (max-width: $media-sm) {
            order: 1;
            margin-top: 1.6rem;
            margin-right: 0;
          }
        }
      }
    }

    &__instance_calendar {
      padding: 1.6rem 0.8rem;

      @media (max-width: $media-sm) {
        padding: 2.4rem 1.3rem 0;
      }
    }

    &__calendar {
      display: grid;
      grid-gap: 1.6rem;
      grid-template-columns: 1fr;
      font-family: $font-family;

      @media (max-width: $media-sm) {
        grid-gap: 0.8rem;
      }

      &_wrap {
        align-items: stretch;
      }

      &_header {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-bottom: 1rem;
        font-family: $font-family;

        &_separator {
          display: none;
        }

        &_item {
          flex-grow: 0;
          width: 100%;
          min-width: 3.2rem;
          height: 2.1rem;
          padding: 0;
          color: $gray-500;
          text-align: center;

          @include body-14;
        }
      }

      &_row {
        margin: 0;
      }

      &_item {
        position: relative;
        display: flex;
        justify-content: center;
        color: $gray-600;

        @include body-16;

        .dp__cell {
          &_inner {
            padding: 0 0.8rem;

            @media (max-width: $media-sm) {
              padding: 0 0.3rem;
            }
          }
        }
      }
    }

    &__cell {
      &_inner {
        position: static;
        align-self: center;
        box-sizing: content-box;
        width: 100%;
        min-width: 3.2rem;
        height: 3.2rem;
        color: $gray-600;
        border: none;

        @include body-16;
      }

      &_disabled,
      &_offset {
        color: $gray-500;
      }
    }

    &__today {
      border: none;
    }

    &__range {
      &_start,
      &_end {
        @include active;
      }

      &_start:not(.dp__range_end, .dp__date_hover_end, .dp__date_hover_start) {
        @include highlight {
          right: 0;
          left: auto;
          width: 50%;
        }
      }

      &_end:not(.dp__range_start, .dp__date_hover_end, .dp__date_hover_start) {
        @include highlight {
          left: 0;
          width: 50%;
        }
      }

      &_between:not(.dp__date_hover_end, .dp__date_hover_start) {
        background: transparent;

        @include highlight {
          left: 0;
          width: 100%;
        }
      }
    }

    &__date_hover {
      &_start,
      &_end {
        background: transparent;
      }
    }

    // &__date_hover {
    //   &_start,
    //   &_end {
    //     &:not(.dp__cell_disabled) {
    //       &:hover {
    //         @include active;
    //       }
    //     }

    //     &:hover {
    //       background: transparent;
    //     }
    //   }

    //   &_start:not(.dp__cell_disabled) {
    //     &:hover {
    //       @include highlight {
    //         left: auto;
    //         right: 0;
    //         width: 50%;
    //       }
    //     }
    //   }

    //   &_end:not(.dp__cell_disabled) {
    //     &:hover {
    //       @include highlight {
    //         left: 0;
    //         width: 50%;
    //       }
    //     }
    //   }

    //   &:hover {
    //     background: transparent;
    //   }
    // }

    &__active_date {
      @include active;

      z-index: 0;
    }
  }
}
</style>
