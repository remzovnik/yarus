<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { MainFeedFilter } from "@/domain/MainFeed/MainFeedFilter";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { YarusApiService } from "@/modules/Yarus/YarusApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { IMainFeedFilterYarusPayload } from "@/domain/MainFeed/IMainFeedFilterYarusPayload.interface";
import MainFeedFilterYarus from "@/modules/MainFeed/components/MainFeedFilterYarus.vue";
import { IMainFeedFilterTypePayload } from "@/domain/MainFeed/IMainFeedFilterTypePayload.interface";
import MainFeedFilterType from "@/modules/MainFeed/components/MainFeedFilterType.vue";
import { appConfig } from "@/appConfig";

const emit = defineEmits<{
  (e: "updateFilter", payload: MainFeedFilter): void;
  (e: "initCreateYarus"): void;
  (e: "wasChanged"): void;
}>();

const props = defineProps<{
  filter: MainFeedFilter;
}>();

const filter = ref<MainFeedFilter>(props.filter);
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const pagination = ref<PaginationModel>(new PaginationModel({ perPage: appConfig.maxYarusCreatedCount }));
const areTypesCollapsed = ref<boolean>(false);

const isCreateYarusDisabled = computed<boolean>(() => {
  return filter.value.yarusList.length >= appConfig.maxYarusCreatedCount;
});

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(YarusApiService).getYarusList(pagination.value);

  if (chunk.length) {
    pagination.value.currentPage++;
    filter.value.setYarusList(chunk);
  } else {
    isLoaded.value = true;
  }

  isLoading.value = false;
};

const switchType = (payload: IMainFeedFilterTypePayload): void => {
  filter.value.switchType(payload);
  emit("wasChanged");
};

const switchSelectAllTypes = (isChecked: boolean): void => {
  filter.value.switchSelectAllTypes(isChecked);
  emit("wasChanged");
};

const switchYarus = (payload: IMainFeedFilterYarusPayload): void => {
  filter.value.switchYarus(payload);
  emit("wasChanged");
};

const switchDefaultYarus = (): void => {
  filter.value.switchDefaultYarus();
  emit("wasChanged");
};

onMounted(() => {
  filter.value.rawYarusList = [];
});

watch(
  () => filter.value,
  (newVal) => {
    emit("updateFilter", newVal);
  },
  { deep: true }
);
</script>

<template>
  <div class="main-feed-filter-settings">
    <section class="main-feed-filter-types">
      <button class="main-feed-filter-types__header" type="button" @click="areTypesCollapsed = !areTypesCollapsed">
        Тип контента
        <BaseIcon :name="areTypesCollapsed ? 'arrow-down' : 'arrow-up'" />
      </button>

      <div v-if="!areTypesCollapsed" class="main-feed-filter-types__list">
        <label class="main-feed-filter-type main-feed-filter-type_filled">
          <div class="main-feed-filter-type__text">
            <div class="main-feed-filter-type__title">
              {{ filter.allTypes.title }}
            </div>

            <div class="main-feed-filter-type__description">
              {{ filter.allTypes.description }}
            </div>
          </div>

          <BaseSwitcher :model-value="filter.allTypes.isChecked" @change="switchSelectAllTypes" />
        </label>

        <MainFeedFilterType
          v-for="typeModel in filter.typesList"
          :key="typeModel.id"
          class="main-feed-filter-settings__type"
          :model="typeModel"
          @switch="switchType"
        />
      </div>
    </section>

    <label class="main-feed-filter-settings__default-feed main-feed-filter-yarus">
      <div class="main-feed-filter-yarus__leftside">
        <img class="main-feed-filter-yarus__avatar" src="/images/yarus_avatar.svg" alt="аватар яруса" />

        <div class="main-feed-filter-yarus__text">
          <div class="main-feed-filter-yarus__title">Общий ЯRUS</div>

          <div class="main-feed-filter-yarus__description">Весь контент с площадки</div>
        </div>
      </div>

      <BaseCheckbox :is-checked="Boolean(filter.defaultFeed)" @change="switchDefaultYarus" />
    </label>

    <section class="main-feed-filter-yaruses">
      <div class="main-feed-filter-yaruses__header">
        <h2 class="main-feed-filter-yaruses__title">Мои ЯRUSы</h2>

        <div class="main-feed-filter-yaruses__count">Выбрано {{ filter.yarusesCheckedCount }}/20</div>
      </div>

      <BaseButton
        class="main-feed-filter-settings__create-btn"
        is-outlined
        icon="plus"
        is-full-width
        :is-disabled="isCreateYarusDisabled"
        @click="emit('initCreateYarus')"
        >Создать новый ярус</BaseButton
      >

      <div v-if="filter.isSomeYarusBlocked" class="main-feed-filter-settings__warning">
        Из-за в выбранных настроек типа контента, некоторые ЯRUSы не будут отображаться
      </div>

      <div v-if="isCreateYarusDisabled" class="main-feed-filter-settings__warning">
        Создано максимальное количество ЯRUSов. Чтобы добавить новый, нужно удалить или отредактировать текущие.
      </div>

      <div v-if="filter.areMaxYarusSelected" class="main-feed-filter-settings__warning">
        Выбрано максимальное количество ЯRUSов.
      </div>

      <div class="main-feed-filter-yaruses__list">
        <div v-if="filter.yarusList.length">
          <MainFeedFilterYarus
            v-for="yarusModel in filter.yarusList"
            :key="yarusModel.yarus.id"
            class="main-feed-filter-yaruses__item"
            :model="yarusModel"
            :is-disabled="(filter.areMaxYarusSelected && !yarusModel.isChecked) || yarusModel.isBlocked"
            @switch="switchYarus"
          />
        </div>
        <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadDataChunk" />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.main-feed-filter-settings {
  &__default-feed {
    margin-top: 2.4rem;
  }

  &__type {
    border-top: 1px solid $gray-200;

    &:nth-of-type(2) {
      border-top: none;
    }
  }

  &__create-btn {
    margin-bottom: 0.8rem;
  }

  &__warning {
    @include body-14;

    margin-top: 1.2rem;
    color: $gray-500;
  }

  .main-feed-filter-types {
    &__header {
      @include label-16-bold;

      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      color: $gray-900;
    }

    &__list {
      margin-top: 1.6rem;
    }
  }

  .main-feed-filter-yaruses {
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.6rem 0;
    }

    &__count {
      @include body-14;

      color: $gray-700;
    }

    &__item {
      margin-top: 0.8rem;
    }
  }
}
</style>
