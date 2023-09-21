<script lang="ts" setup>
import RouteModel from "@/modules/Main/models/RouteModel";
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import DropdownCity from "@/modules/Main/components/dropdowns/DropdownCity.vue";
import { useStore } from "@/modules/Main/stores/MainStore";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const router = useRouter();

type PageType = "all" | "federal" | "city";

const mainStore = useStore();

const props = defineProps<{ page: PageType; activeCityId?: string }>();

const cityId = ref<string | undefined>(undefined);

const setCityFilter = (id) => {
  let route: RouteModel;

  if (id === null) {
    route = { name: ERouteName.NEWS_ALL, params: { activeCityId: null } };
    router.push(route);
  } else {
    route = { name: ERouteName.NEWS_CITY, params: { id } };
    router.push(route);
  }
};

const handleCityFilterShow = (): void => {
  if (!!props.activeCityId && props.page !== "city") {
    const route: RouteModel = { name: ERouteName.NEWS_CITY, params: { id: cityId.value } };
    router.push(route);
  }
};

const cityFilterLabel = computed<string | undefined>(() => {
  if (!cityId.value) {
    return "Выбрать город";
  } else {
    return mainStore.cities.find((city) => city.id === Number(cityId.value))?.name;
  }
});

const allNewsRoute = computed<RouteModel>(() => {
  return { name: ERouteName.NEWS_ALL, params: { activeCityId: cityId.value } };
});

const federalNewsRoute = computed<RouteModel>(() => {
  return { name: ERouteName.NEWS_FEDERAL, params: { activeCityId: cityId.value } };
});

watchEffect(() => {
  cityId.value = props.activeCityId;
});
</script>

<template>
  <div class="news-filter">
    <BaseChips
      class="news-filter__item"
      type="choice"
      :is-active="page === 'all'"
      :route="allNewsRoute"
      aria-label="Выбрать все источники"
    >
      Все источники
    </BaseChips>
    <BaseChips
      class="news-filter__item"
      type="choice"
      :is-active="page === 'federal'"
      :route="federalNewsRoute"
      aria-label="Выбрать федеральные СМИ"
    >
      Федеральные СМИ
    </BaseChips>

    <div class="news-filter__item">
      <VDropdown theme="mobile-fullscreen" @show="handleCityFilterShow">
        <BaseChips type="choice-icon" :is-active="page === 'city'" aria-label="Выбрать новости города">
          {{ cityFilterLabel }}
        </BaseChips>
        <template #popper="{ hide }">
          <DropdownCity :active-id="cityId" @select="setCityFilter" @close="hide" />
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="scss">
.news-filter {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: $media-sm) {
    @include hide-scroll;

    width: calc(100% + 1.6rem);
    margin-right: -1.6rem;
    overflow-x: auto;
    overflow-y: hidden;
  }

  &__item {
    margin-right: 0.8rem;
  }
}
</style>
