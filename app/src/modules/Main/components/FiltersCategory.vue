<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FilterItemModel from "@/modules/Main/models/FilterItemModel";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { Swiper, SwiperSlide } from "swiper/vue";
import { appConfig } from "@/appConfig";
import { useBreakpoints } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const props = withDefaults(
  defineProps<{
    list: FilterItemModel[];
    title: string;
    savedList?: number[];
  }>(),
  {
    savedList: () => [],
  }
);

const emit = defineEmits<{
  (e: "changeList", list: number[]): void;
}>();

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile });
const isMobile: Ref<boolean> = breakpoints.smaller("mobile");

const selectedList = ref<number[]>([]);
const isShowCategories = ref(true);

const selectAll = () => {
  selectedList.value = [];
  props.list.forEach((item) => {
    selectedList.value.push(item.id);
  });
  categoriesChangeHandler();
};

const selectGroup = (list: number[]): void => {
  selectedList.value = list;
  categoriesChangeHandler();
};

const categoryClickHandler = (id: number): void => {
  if (selectedList.value.length === 1 && selectedList.value.includes(id)) {
    return;
  }

  if (selectedList.value.includes(id)) {
    selectedList.value.splice(selectedList.value.indexOf(id), 1);
  } else {
    selectedList.value.push(id);
  }
  debouncedFn();
};

const selectAllBtnClickHandler = (): void => {
  if (isSelectAll.value) {
    return;
  }
  selectAll();
};

const showCategoriesClickHandler = (): void => {
  isShowCategories.value = !isShowCategories.value;
};

const categoriesChangeHandler = (): void => {
  emit("changeList", selectedList.value);
};

const debouncedFn = useDebounceFn(() => {
  categoriesChangeHandler();
}, 500);

const isSelectAll = computed<boolean>(() => {
  return props.list.length === selectedList.value.length;
});

const init = (): void => {
  if (authStore.checkAuth()) {
    const list = props.list.filter((item) => item.enable).map((item) => item.id);
    list.length ? selectGroup(list) : selectAll();
  } else if (props.savedList.length) {
    const list = props.list.filter((item) => props.savedList.includes(item.id)).map((item) => item.id);
    list.length ? selectGroup(list) : selectAll();
  } else {
    selectAll();
  }
};

const calcIcon = (item: FilterItemModel): string | undefined => {
  return selectedList.value.includes(item.id) ? item.webIconActive : item.webIconInactive;
};

onMounted((): void => {
  init();
});
</script>

<template>
  <div class="filter-category">
    <div class="filter-category__header">
      <button class="filter-category__title" type="button" :aria-label="props.title" @click="showCategoriesClickHandler">
        {{ props.title }}: {{ selectedList?.length }} из {{ list?.length }}
        <BaseIcon class="filter-category__arrow-icon" :name="isShowCategories ? 'arrow-up' : 'arrow-down'" />
      </button>
      <BaseButton v-if="!isSelectAll" type="transparent" class="filter-category__select-all" @click="selectAllBtnClickHandler">
        Выбрать всё
      </BaseButton>
    </div>

    <div v-if="isShowCategories" class="filter-category__list">
      <template v-if="isMobile">
        <swiper :slides-per-view="'auto'" :space-between="8">
          <swiper-slide v-for="(item, index) in props.list" :key="index">
            <BaseChips
              :icon-url="calcIcon(item)"
              type="filter"
              class="filter-category__item"
              :is-active="selectedList.includes(item.id)"
              @click="categoryClickHandler(item.id)"
            >
              {{ item.name }}
            </BaseChips>
          </swiper-slide>
        </swiper>
      </template>

      <template v-else>
        <BaseChips
          v-for="(item, index) in props.list"
          :key="index"
          :icon-url="calcIcon(item)"
          type="filter"
          class="filter-category__item"
          :is-active="selectedList.includes(item.id)"
          @click="categoryClickHandler(item.id)"
        >
          {{ item.name }}
        </BaseChips>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.filter-category {
  margin-bottom: 3.6rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.6rem;
  }

  &__title {
    @include headline-16;

    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__arrow-icon {
    margin-left: 1.8rem;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    margin-right: 0.8rem;
    margin-bottom: 0.8rem;

    @media (max-width: $media-sm) {
      margin-right: 0;
      margin-bottom: 0;
    }
  }

  &__select-all {
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

  .swiper {
    margin: 0;

    .swiper-slide {
      width: auto;
    }
  }
}
</style>
