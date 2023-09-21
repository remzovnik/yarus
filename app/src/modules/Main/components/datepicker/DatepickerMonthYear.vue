<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { computed, ref, watch, watchEffect } from "vue";

interface MonthYear {
  value: number;
  text: string;
}

interface UpdateMonthYear {
  instance: 0;
  month: number;
  year: number;
}

const emit = defineEmits<{
  (event: "update-month-year", value: UpdateMonthYear): void;
}>();

const props = defineProps<{
  months: MonthYear[]; // value: 0-11, text: name of the month
  years: MonthYear[]; // generated array of years based on provided range, text and value are the same
  month: number; // This is the value of the selected month
  year: number; //  This is the value of the selected year
  minDate?: Date | string;
  maxDate?: Date | string;
}>();

const menu = ref();
const isMenuShown = ref(false);
const isYearMenu = ref(false);
const yearsChunks = ref<MonthYear[][]>([]);
const currentYearsChunkIndex = ref(0);
const pickedYear = ref(props.year);
const YEARS_CHUNK_SIZE = 12;
const MONTHS_SHORT = [
  { text: "янв", value: 0 },
  { text: "фев", value: 1 },
  { text: "мар", value: 2 },
  { text: "апр", value: 3 },
  { text: "май", value: 4 },
  { text: "июнь", value: 5 },
  { text: "июль", value: 6 },
  { text: "авг", value: 7 },
  { text: "сен", value: 8 },
  { text: "окт", value: 9 },
  { text: "нояб", value: 10 },
  { text: "дек", value: 11 },
];

const chunkArray = (myArray: MonthYear[], chunk_size = YEARS_CHUNK_SIZE): MonthYear[][] => {
  let index = 0;
  const arrayLength: number = myArray.length;
  const tempArray: MonthYear[][] = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk: MonthYear[] = myArray.slice(index, index + chunk_size);
    tempArray.push(myChunk);
  }

  return tempArray;
};

const currentMonth = computed<MonthYear | undefined>(() => {
  return props.months.find((el) => el.value === props.month);
});

const currentYear = computed<MonthYear | undefined>(() => {
  return props.years.find((el) => el.value === props.year);
});

const currentYearsChunk = computed<MonthYear[] | undefined>(() => {
  return yearsChunks.value[currentYearsChunkIndex.value];
});

const menuTitle = computed<string>(() => {
  return `${currentMonth.value?.text} ${currentYear.value?.text} г.`;
});

const yearMenuTitle = computed<string>(() => {
  return `${currentYearsChunk.value?.[0].text} - ${currentYearsChunk.value?.[currentYearsChunk.value.length - 1].text}`;
});

const monthMenuTitle = computed<string>(() => {
  return props.years.find((el) => el.value === pickedYear.value)?.text || "";
});

const minMonth = computed<number | undefined>(() => {
  return props.minDate ? new Date(props.minDate).getMonth() : undefined;
});

const maxMonth = computed<number | undefined>(() => {
  return props.maxDate ? new Date(props.maxDate).getMonth() : undefined;
});

const minYear = computed<number | undefined>(() => {
  return props.minDate ? new Date(props.minDate).getFullYear() : undefined;
});

const maxYear = computed<number | undefined>(() => {
  return props.maxDate ? new Date(props.maxDate).getFullYear() : undefined;
});

const monthMenuPreviousValid = computed<boolean>(() => {
  return !!(minYear.value && minYear.value >= pickedYear.value);
});

const monthMenuNextValid = computed<boolean>(() => {
  return !!(maxYear.value && maxYear.value <= pickedYear.value);
});

const yearMenuPreviousValid = computed<boolean>(() => {
  return !!(minYear.value && currentYearsChunk.value && minYear.value >= currentYearsChunk.value[0].value);
});

const yearMenuNextValid = computed<boolean>(() => {
  return !!(
    maxYear.value &&
    currentYearsChunk.value &&
    maxYear.value <= currentYearsChunk.value[currentYearsChunk.value.length - 1].value
  );
});

const checkIfValid = (year: number, month?: number): boolean => {
  if (minMonth.value !== undefined && minYear.value && maxMonth.value !== undefined && maxYear.value) {
    return (
      (year > minYear.value || (year === minYear.value && (month === undefined || month >= minMonth.value))) &&
      (year < maxYear.value || (year === maxYear.value && (month === undefined || month <= maxMonth.value)))
    );
  } else if (minMonth.value !== undefined && minYear.value) {
    return year > minYear.value || (year === minYear.value && (month === undefined || month >= minMonth.value));
  } else if (maxMonth.value !== undefined && maxYear.value) {
    return year < maxYear.value || (year === maxYear.value && (month === undefined || month <= maxMonth.value));
  } else {
    return true;
  }
};

const checkIfActive = (year: number, month?: number): boolean => {
  return year === props.year && (month === undefined || month === props.month);
};

const getMonthShortText = (value: number): string => {
  return MONTHS_SHORT.find((el) => el.value === value)?.text || "";
};

const showMenu = (value: boolean): void => {
  if (value === false) {
    showYearMenu(false);
    resetMenu();
  }
  isMenuShown.value = value;
};

const showYearMenu = (value: boolean): void => {
  isYearMenu.value = value;
};

const resetMenu = (): void => {
  pickedYear.value = props.year;
  currentYearsChunkIndex.value = yearsChunks.value.findIndex((el) => el.includes(currentYear.value as MonthYear));
};

const toPreviousMonth = (): void => {
  emit("update-month-year", {
    instance: 0,
    month: props.month === 0 ? 11 : props.month - 1,
    year: props.month === 0 ? props.year - 1 : props.year,
  });
};

const toNextMonth = (): void => {
  emit("update-month-year", {
    instance: 0,
    month: props.month === 11 ? 0 : props.month + 1,
    year: props.month === 11 ? props.year + 1 : props.year,
  });
};

const toPreviousYear = (): void => {
  pickedYear.value--;
};

const toNextYear = (): void => {
  pickedYear.value++;
};

const toPreviousYearsChunk = (): void => {
  currentYearsChunkIndex.value--;
};

const toNextYearsChunk = (): void => {
  currentYearsChunkIndex.value++;
};

const pickMonth = (value: number): void => {
  emit("update-month-year", { instance: 0, month: value, year: pickedYear.value });
  showMenu(false);
};

const pickYear = (value: number): void => {
  pickedYear.value = value;
  showYearMenu(false);
};

watchEffect(() => {
  yearsChunks.value = chunkArray(props.years);
  currentYearsChunkIndex.value = yearsChunks.value.findIndex((el) => el.includes(currentYear.value as MonthYear));
});

watch(
  () => props.year,
  () => {
    resetMenu();
  },
  { immediate: true }
);

onClickOutside(menu, () => {
  showMenu(false);
});
</script>

<template>
  <div class="datepicker-month-year">
    <div class="datepicker-month-year__header">
      <BaseIcon
        class="datepicker-month-year__arrow"
        name="arrow-left"
        :class="{
          'datepicker-month-year__arrow_disabled': !checkIfValid(year, month - 1),
        }"
        @click="toPreviousMonth"
      />
      <button class="datepicker-month-year__title" @click="showMenu(true)">{{ menuTitle }}</button>
      <BaseIcon
        class="datepicker-month-year__arrow"
        name="arrow-right"
        :class="{
          'datepicker-month-year__arrow_disabled': !checkIfValid(year, month + 1),
        }"
        @click="toNextMonth"
      />
    </div>

    <section v-if="isMenuShown" ref="menu" class="datepicker-month-year__menu">
      <template v-if="isYearMenu">
        <header class="datepicker-month-year__menu-header">
          <BaseIcon
            class="datepicker-month-year__arrow"
            name="arrow-left"
            :class="{
              'datepicker-month-year__arrow_disabled': yearMenuPreviousValid,
            }"
            @click="toPreviousYearsChunk"
          />
          <button class="datepicker-month-year__title" @click="showYearMenu(!isYearMenu)">{{ yearMenuTitle }}</button>
          <BaseIcon
            class="datepicker-month-year__arrow"
            name="arrow-right"
            :class="{
              'datepicker-month-year__arrow_disabled': yearMenuNextValid,
            }"
            @click="toNextYearsChunk"
          />
        </header>
        <main class="datepicker-month-year__menu-main">
          <button
            v-for="item in currentYearsChunk"
            :key="item.value"
            class="datepicker-month-year__menu-main-item"
            :class="{
              'datepicker-month-year__menu-main-item_active': checkIfActive(item.value),
              'datepicker-month-year__menu-main-item_disabled': !checkIfValid(item.value),
            }"
            :aria-label="item.text"
            @click="pickYear(item.value)"
          >
            {{ item.text }}
          </button>
        </main>
      </template>

      <template v-if="!isYearMenu">
        <header class="datepicker-month-year__menu-header">
          <BaseIcon
            class="datepicker-month-year__arrow"
            name="arrow-left"
            :class="{
              'datepicker-month-year__arrow_disabled': monthMenuPreviousValid,
            }"
            @click="toPreviousYear"
          />
          <button class="datepicker-month-year__title" @click="showYearMenu(!isYearMenu)">{{ monthMenuTitle }}</button>
          <BaseIcon
            class="datepicker-month-year__arrow"
            name="arrow-right"
            :class="{
              'datepicker-month-year__arrow_disabled': monthMenuNextValid,
            }"
            @click="toNextYear"
          />
        </header>
        <main class="datepicker-month-year__menu-main">
          <button
            v-for="item in months"
            :key="item.value"
            class="datepicker-month-year__menu-main-item"
            :class="{
              'datepicker-month-year__menu-main-item_active': checkIfActive(pickedYear, item.value),
              'datepicker-month-year__menu-main-item_disabled': !checkIfValid(pickedYear, item.value),
            }"
            :aria-label="`${item.text} ${currentYear?.text}`"
            @click="pickMonth(item.value)"
          >
            {{ getMonthShortText(item.value) }}
          </button>
        </main>
      </template>
    </section>
  </div>
</template>

<style lang="scss">
.datepicker-month-year {
  position: relative;
  margin-bottom: 2rem;

  &__title {
    @include body-16;

    color: $gray-600;
    cursor: pointer;
  }

  &__header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
  }

  &__menu {
    position: absolute;
    top: calc(100% + 0.7rem);
    left: 50%;
    z-index: 1000;
    padding: 1.6rem;
    background: $white-100;
    border-radius: $border-radius-md;
    box-shadow: $box-shadow-deep;
    transform: translateX(-50%);

    &-header {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
    }

    &-main {
      display: grid;
      grid-gap: 0.8rem;
      grid-template-columns: repeat(3, 1fr);

      &-item {
        padding: 0.6rem 0.8rem;
        color: $gray-600;
        background: $gray-200;
        border-radius: $border-radius-lg;

        @include label-14;

        &_active {
          color: $white-100;
          background: $blue-100;
        }

        &_disabled {
          opacity: 0.3;
          pointer-events: none;
        }
      }
    }
  }

  &__arrow {
    cursor: pointer;

    &_disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  }
}
</style>
