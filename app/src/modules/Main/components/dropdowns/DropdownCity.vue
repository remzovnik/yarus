<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MainService from "@/modules/Main/apiServices/MainService";
import CityModel from "@/modules/Main/models/CityModel";
import SearchInput from "@/modules/Main/components/form/SearchInput.vue";
import { useStore } from "@/modules/Main/stores/MainStore";
import { PaginationModel } from "@/_core/models/PaginationModel";

const mainStore = useStore();

const emit = defineEmits(["select", "close"]);

const props = defineProps<{
  activeId?: string | number;
}>();

const limit = 20;
let offset = ref(0);
const list = ref();
const cities = ref<CityModel[]>([]);
const filteredCities = ref<CityModel[]>([]);
let activeCityId = ref<number | null>();
const paginationCities = ref<PaginationModel>(new PaginationModel());
const filteredValue = ref<string>("");

const loadDataChunk = async (): Promise<void> => {
  //todo:вылечить скролл и добавить поиск!
  if (!mainStore.cities.length) {
    const allCities = await ServiceLocator.instance.getService(MainService).getCities();
    await mainStore.setCities(allCities);
  }

  if (filteredValue.value.length > 1) {
    filteredCities.value = mainStore.cities
      .filter((city) => city.name.toLowerCase().includes(filteredValue.value.toLowerCase()))
      .slice(0, paginationCities.value.currentPage * limit);
  } else {
    cities.value = mainStore.cities.slice(0, paginationCities.value.currentPage * limit);
    filteredCities.value = [...cities.value];
  }

  if (props.activeId) {
    activeCityId.value = +props.activeId;
  }
};

watch(filteredValue, (): void => {
  list.value.scrollTop = 0;

  loadDataChunk();
});

const changeSearchbar = (value) => {
  filteredValue.value = value;
};

const clearSearchbar = (): void => {
  filteredValue.value = "";
};

const scroll = (): void => {
  const relScroll = list.value.scrollHeight - list.value.scrollTop;
  if (relScroll - list.value.clientHeight < 100 && hasMoreCities.value) {
    paginationCities.value.currentPage++;
    loadDataChunk();
  }
};

const selectCity = (id: number): void => {
  activeCityId.value = id;
};

const saveCity = (): void => {
  emit("close");
  emit("select", activeCityId.value);
};

const clearCity = (): void => {
  activeCityId.value = null;
  emit("select", null);
  emit("close");
};

const closeDropdownHandler = (): void => {
  emit("close");
};

const hasMoreCities = computed<boolean>(() => {
  return mainStore.cities.length - 1 > filteredCities.value.length;
});

onMounted(() => paginationCities.value.currentPage++);

watch(filteredValue, (): void => {
  list.value.scrollTop = 0;

  loadDataChunk();
});

loadDataChunk();
</script>

<template>
  <div class="dropdown-filter">
    <div class="dropdown-filter__content">
      <h2 class="dropdown-filter__title">Город</h2>

      <SearchInput placeholder="Город" @input="changeSearchbar" @clear="clearSearchbar" />

      <div ref="list" class="dropdown-filter__list">
        <label v-for="(city, index) in filteredCities" :key="index" class="dropdown-filter-item dropdown-filter__item">
          <div>
            <div class="dropdown-filter-item__title">{{ city.name }}</div>

            <div class="dropdown-filter-item__desc">{{ city.region }}</div>
          </div>

          <input
            class="dropdown-filter-item__radio"
            type="radio"
            name="cities"
            :checked="activeCityId === city.id"
            @input="selectCity(city.id)"
          />
          <div class="dropdown-filter-item__radio-view"></div>
        </label>
        <BaseInfiniteScroll @on-intersect="scroll" />
      </div>
    </div>

    <div class="dropdown-filter__controls">
      <BaseButton class="dropdown-filter__button" @click="saveCity">Сохранить</BaseButton>
      <BaseButton class="dropdown-filter__button" type="secondary" @click="clearCity">Очистить</BaseButton>
    </div>

    <BaseButton class="dropdown-filter__close" icon="close" type="transparent" @click="closeDropdownHandler" />
  </div>
</template>
