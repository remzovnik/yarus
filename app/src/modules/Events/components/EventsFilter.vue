<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import EventsFilterModel from "@/modules/Events/models/EventsFilterModel";
import EventService from "../EventService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import DropdownCity from "@/modules/Main/components/dropdowns/DropdownCity.vue";
import DropdownPrice from "@/modules/Main/components/dropdowns/DropdownPrice.vue";
import FiltersCategory from "@/modules/Main/components/FiltersCategory.vue";
import Datepicker from "@/modules/Main/components/datepicker/Datepicker.vue";
import { useStore } from "@/modules/Main/stores/MainStore";
import MainService from "@/modules/Main/apiServices/MainService";
import FilterItemModel from "@/modules/Main/models/FilterItemModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useEventsStore } from "@/modules/Events/store/EventsStore";
import { seanceFilter } from "@/_core/utils/DateUtils";
import DateRangeModel from "@/modules/Main/models/DateRangeModel";
import { eventsConfig } from "@/appConfig";
import { useRoute } from "vue-router";

const eventsStore = useEventsStore();
const authStore = useAuthStore();
const mainStore = useStore();
const emitter: any = inject("emitter");
const route = useRoute();

const props = defineProps<{ modelValue: EventsFilterModel }>();

const emit = defineEmits<{
  (e: "update:modelValue", payload: EventsFilterModel): void;
}>();

const model = ref(new EventsFilterModel());
const categoryList = ref<FilterItemModel[]>([]);
const selectedDates = ref<DateRangeModel>(new DateRangeModel());
const isLoading = ref(true);

const cityFilterLabel = computed<string | undefined>(() => {
  if (!model.value.cityId || !mainStore.cities.length) {
    return "Город";
  } else {
    return mainStore.cities.find((city) => city.id === Number(model.value.cityId))?.name;
  }
});

const priceFilterLabel = computed<string>(() => {
  if (!model.value.freeOnly) {
    return "Цена";
  } else {
    return "Бесплатные";
  }
});

const dateFilterLabel = computed<string>(() => {
  if (!selectedDates.value.start || !selectedDates.value.end) {
    return "Дата";
  } else {
    return seanceFilter([selectedDates.value.start, selectedDates.value.end]);
  }
});

const selectedCategoriesCount = computed<number>(() => {
  return model.value?.categories?.length || 0;
});

const fetchData = async (): Promise<void> => {
  if (!mainStore.cities.length) {
    const allCities = await ServiceLocator.instance.getService(MainService).getCities();
    await mainStore.setCities(allCities);
  }
  categoryList.value = await ServiceLocator.instance.getService(EventService).getCategoryList();
  eventsStore.initialCategories = categoryList.value.map((item) => item.id);
  isLoading.value = false;
};

const changeSelectedCategoryList = (id: number): void => {
  if (!model.value.categories) {
    model.value.categories = [];
    model.value.categories.push(id);
  } else {
    if (model.value.categories.includes(id)) {
      const index = model.value.categories.findIndex((item) => item == id);
      model.value.categories.splice(index, 1);
    } else {
      model.value.categories.push(id);
    }
  }
  emit("update:modelValue", model.value);
};

const setCityFilter = (cityId: number): void => {
  model.value.cityId = cityId;
  emit("update:modelValue", model.value);
};

const setPriceFilter = (isFree: boolean): void => {
  model.value.freeOnly = isFree;
  emit("update:modelValue", model.value);
};

const setDatesFilter = (): void => {
  model.value.since = selectedDates.value.start || null;
  model.value.till = selectedDates.value.end || undefined;
  emit("update:modelValue", model.value);
};

const categoryListChangeHandler = (list): void => {
  model.value.categories = list;
  emit("update:modelValue", model.value);

  if (authStore.checkAuth()) {
    saveSelectCategories(list);
  }
};

const saveSelectCategories = async (list) => {
  const result = await ServiceLocator.instance.getService(EventService).setCategoryList(list);
  return result;
};

const categoryIsSelected = (id: number): boolean => {
  return Array.isArray(model.value.categories) && model.value.categories.includes(id);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      let filters = new EventsFilterModel();
      if (route.query.freeOnly) filters.freeOnly = route.query.freeOnly === "true";
      if (route.query.cityId) filters.cityId = +route.query.cityId;
      if (route.query.since) filters.since = +route.query.since;
      if (route.query.till) filters.till = +route.query.till;
      filters = { ...filters, ...newValue };
      model.value = new EventsFilterModel(filters);
      selectedDates.value.start = model.value?.since || null;
      selectedDates.value.end = model.value?.till || null;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

fetchData();

emitter.on(eventsConfig.authLogout, fetchData);
emitter.on(eventsConfig.authLogin, fetchData);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.authLogout, fetchData);
  emitter.off(eventsConfig.authLogin, fetchData);
});
</script>

<template>
  <div class="events-filter">
    <div v-if="!isLoading" class="events-filter__chips">
      <Datepicker v-model="selectedDates" is-range is-future @select-date="setDatesFilter">
        <template #trigger>
          <BaseChips type="filter-icon" :is-active="!!selectedDates?.start && !!selectedDates?.end" aria-label="Выбрать даты">
            {{ dateFilterLabel }}
          </BaseChips>
        </template>
      </Datepicker>

      <VDropdown theme="mobile-fullscreen" placement="bottom-start">
        <BaseChips type="filter-icon" :is-active="!!model.cityId" aria-label="Выбрать город">
          {{ cityFilterLabel }}
        </BaseChips>
        <template #popper="{ hide }">
          <DropdownCity :active-id="model.cityId" @select="setCityFilter" @close="hide()" />
        </template>
      </VDropdown>

      <VDropdown theme="mobile-fullscreen" placement="bottom-start">
        <BaseChips type="filter-icon" :is-active="!!model.freeOnly" aria-label="Выбрать цену">
          {{ priceFilterLabel }}
        </BaseChips>
        <template #popper="{ hide }">
          <DropdownPrice :price-value="model?.freeOnly" @select="setPriceFilter" @close="hide()" />
        </template>
      </VDropdown>
    </div>

    <FiltersCategory
      v-if="categoryList.length"
      title="Выбрано категорий"
      :list="categoryList"
      :saved-list="modelValue.categories || []"
      @change-list="categoryListChangeHandler"
    />
  </div>
</template>

<style lang="scss">
.events-filter {
  &__chips {
    @include hide-scroll;

    display: flex;
    margin-bottom: 2.4rem;

    @media (max-width: $media-sm) {
      flex-wrap: nowrap;
      overflow-x: scroll;
    }

    .base-chips {
      margin-right: 0.8rem;
    }
  }

  &__categories-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;
  }

  &__categories-title {
    @include headline-16;

    display: flex;
    cursor: pointer;
    transition: $trs-back;

    &:hover {
      color: $blue-100;
      transition: $trs-forward;
    }

    span {
      margin-right: 1.6rem;
    }
  }

  &__select-all-btn {
    @include body-16;

    color: $gray-500;
    cursor: pointer;
    transition: $trs-back;

    &:hover {
      color: $gray-600;
      transition: $trs-forward;
    }

    @media (max-width: $media-sm) {
      display: none;
    }
  }

  &__mobile-select-all-btn {
    display: none;

    @include body-16;

    color: $gray-500;
    transition: $trs-back;

    &:hover {
      color: $gray-600;
      transition: $trs-forward;
    }

    @media (max-width: $media-sm) {
      display: flex;
    }
  }

  &__categories-items {
    display: flex;
    flex-wrap: wrap;

    @media (max-width: $media-sm) {
      flex-wrap: nowrap;
      margin-bottom: 1.6rem;
      overflow-x: scroll;
    }

    .base-chips {
      margin-right: 0.8rem;
      margin-bottom: 0.8rem;
    }
  }
}
</style>
