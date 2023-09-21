<script setup lang="ts">
import { computed, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { PaginationModel } from "@/_core/models/PaginationModel";
import EventService from "@/modules/Events/EventService";
import EventsFilter from "../components/EventsFilter.vue";
import { useRouter } from "vue-router";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useEventsStore } from "@/modules/Events/store/EventsStore";
import { appConfig } from "@/appConfig";
import EventsFilterModel from "@/modules/Events/models/EventsFilterModel";
import { useStore } from "@/modules/Main/stores/MainStore";
import CityModel from "@/modules/Main/models/CityModel";
import { cityInCase } from "@/_core/utils/Formaters";
import months from "@/assets/data/months.json";
import SeoEvents from "@/modules/Seo/components/SeoEvents.vue";
import { CaseType } from "@/_core/models/CaseType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import useYarusBreakpoints from "@/modules/Main/composables/useYarusBreakpoints";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const router = useRouter();
const eventsStore = useEventsStore();
const mainStore = useStore();

const filters = ref({ ...eventsStore.filters });
const isLoading = ref<boolean>(true);
const isLoaded = ref<boolean>(false);
const list = ref<TContentCard[]>([]);
const pagination = ref(new PaginationModel({ perPage: appConfig.eventsPerPage }));
const { isBigLaptop } = useYarusBreakpoints();

const title = computed<string>(() => {
  return `События ${cityNameInGenitiveCase.value} ${monthAndYear.value}`;
});

const city = computed<CityModel | undefined>(() => {
  return filters.value.cityId ? mainStore.cities.find((el) => el.id === filters.value.cityId) : undefined;
});

const cityNameInGenitiveCase = computed<string>(() => {
  return city.value ? cityInCase(city.value, CaseType.GENITIVE) : "";
});

const monthAndYear = computed<string>(() => {
  if (filters.value.since && filters.value.till) {
    const date = new Date(Number(filters.value.since * 1000));
    const monthNumber = date.getMonth();
    return `в ${months[monthNumber][CaseType.PREPOSITIONAL]} ${date.getFullYear()}`;
  } else return "";
});

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(EventService).getEvents(pagination.value, filters.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  pagination.value.currentPage++;

  list.value = [...list.value, ...chunk];

  if (!list.value.length) {
    const limit = !isBigLaptop.value ? 5 : 15;

    list.value = await ServiceLocator.instance.getService(EventService).getEventsRecommendationList(limit);
  }

  isLoading.value = false;
};

const updateFilters = (value: EventsFilterModel): void => {
  filters.value = value;
  isLoaded.value = false;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  list.value = [];
  pagination.value.currentPage = 0;

  loadDataChunk();

  const query = { ...filters.value } as any;

  delete query.limit;
  delete query.offset;
  if (!filters.value.cityId) delete query.cityId;
  if (!filters.value.freeOnly) delete query.isFree;
  if (!filters.value.since) delete query.since;
  if (filters.value.categories?.length) {
    query.categories = filters.value.categories.join(";");
  }

  const route: RouteModel = { name: ERouteName.EVENTS, query };
  router.push(route);
};
</script>

<template>
  <SeoEvents :title="title" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="events-page page">
        <h1 class="events-page__title page-title">{{ title }}</h1>
        <div class="events-page__filter">
          <EventsFilter :model-value="filters" @update:model-value="updateFilters" />
        </div>

        <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk" />
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.events-page {
  &__title {
    margin-bottom: 2.4rem;
  }

  &__filter {
    margin-bottom: 2.4rem;
  }
}
</style>
