<script lang="ts" setup>
import NewsLayout from "@/modules/News/components/NewsLayout.vue";
import NewsCity from "@/modules/News/components/NewsCity.vue";
import { computed, ref } from "vue";
import CityModel from "@/modules/Main/models/CityModel";
import { useStore } from "@/modules/Main/stores/MainStore";
import MainService from "@/modules/Main/apiServices/MainService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { cityInCase } from "@/_core/utils/Formaters";
import SeoNewsCity from "@/modules/Seo/components/SeoNewsCity.vue";
import { CaseType } from "@/_core/models/CaseType";

const mainStore = useStore();

const props = defineProps<{ id: string }>();

const cities = ref<CityModel[]>([]);

const city = computed<CityModel | undefined>(() => {
  return cities.value?.find((el) => el.id === +props.id);
});

const title = computed<string>(() => {
  return `Новости ${cityNameInGenitiveCase.value}`;
});

const cityNameInGenitiveCase = computed<string>(() => {
  return city.value ? cityInCase(city.value, CaseType.GENITIVE) : "";
});

const fetchCities = async (): Promise<void> => {
  if (mainStore.cities.length) {
    cities.value = mainStore.cities;
  } else {
    cities.value = await ServiceLocator.instance.getService(MainService).getCities();
    mainStore.setCities(cities.value);
  }
};

fetchCities();
</script>

<template>
  <SeoNewsCity :city="city" />
  <NewsLayout :title="title">
    <template #page><NewsCity :id="id" /></template>
  </NewsLayout>
</template>
