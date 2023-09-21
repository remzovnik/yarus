<script setup lang="ts">
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { InterestApiService } from "@/modules/Interest/InterestApiService";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { InterestTags } from "@/domain/Interest/InterestTags";
import { PaginationModel } from "@/_core/models/PaginationModel";
import NoContent from "@/modules/Main/components/NoContent.vue";
import InterestSearchUserCard from "@/modules/Interest/components/InterestSearchUserCard.vue";
import { InterestUserCard } from "@/domain/Interest/InterestUserCard";
import { InterestTag } from "@/domain/Interest/InterestTag";

const interestTags = ref<InterestTags>(new InterestTags());
const userList = ref<InterestUserCard[]>([]);
const pagination = ref<PaginationModel>(new PaginationModel());
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const isInited = ref<boolean>(false);
const areAllTagsSelected = ref<boolean>(false);

const fetchData = async (): Promise<void> => {
  interestTags.value.tagList = await ServiceLocator.instance.getService(InterestApiService).getOwnTags();
};

const toggleTag = (item: InterestTag): void => {
  item.toggleSelected();
};

const toggleTagsSelection = (): void => {
  if (areAllTagsSelected.value) {
    interestTags.value.unselectAllTags();
    areAllTagsSelected.value = false;
  } else {
    interestTags.value.selectAllTags();
    areAllTagsSelected.value = true;
  }
};

const initSearch = (): void => {
  if (isInited.value) {
    userList.value = [];
    pagination.value.currentPage = 0;
    isLoaded.value = false;
  } else {
    isInited.value = true;
  }
};

const fetchUserList = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance
    .getService(InterestApiService)
    .getUserList(interestTags.value.selectedTagList, pagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
  }

  userList.value = [...userList.value, ...chunk];
  pagination.value.currentPage++;

  isLoading.value = false;
};

fetchData();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #header> </template>

    <template #content>
      <main class="interest-search-page page">
        <h1 class="page-title">Поиск по интересам</h1>

        <div v-if="interestTags.tagList.length" class="interest-search-page__tag-list">
          <BaseTag
            v-for="(item, index) in interestTags.tagList"
            :key="`tag-${index}`"
            class="interest-search-page__tag"
            theme="light"
            :is-selected="item.isSelected"
            is-selectable
            size="large"
            @click="toggleTag(item)"
          >
            {{ item.tag }}
          </BaseTag>
        </div>

        <BaseButton class="interest-search-page__select-all" is-accent type="transparent" @click="toggleTagsSelection">
          {{ areAllTagsSelected ? "Отменить" : "Выбрать все" }}
        </BaseButton>

        <BaseButton
          class="interest-search-page__search-button"
          type="primary"
          :is-disabled="!interestTags.selectedTagList.length"
          @click="initSearch"
        >
          Найти людей
        </BaseButton>

        <section v-if="isInited" class="interest-search-result">
          <h2 class="interest-search-result__title">Результаты поиска</h2>

          <div v-if="userList.length" class="interest-search-result__grid">
            <div v-for="card in userList" :key="card.user.id" class="interest-search-result__cell">
              <InterestSearchUserCard :model="card" />
            </div>
          </div>

          <NoContent
            v-else-if="isLoaded"
            class="interest-search-result__no-content"
            image="/images/no-results.svg"
            title="Упс..."
          >
            <div>Ничего не найдено.</div>
            Выбери другие интересы
          </NoContent>

          <div v-if="isLoading" class="interest-search-result__grid">
            <div v-for="index in 6" :key="index" class="interest-search-result__cell">
              <div class="interest-search-result__skeleton"></div>
            </div>
          </div>

          <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="fetchUserList" />
        </section>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.interest-search-page {
  &__tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 3.2rem;
  }

  &__select-all {
    margin-top: 2rem;
  }

  &__search-button {
    margin-top: 2.4rem;
  }

  .interest-search-result {
    margin-top: 2.4rem;
    padding-top: 4rem;
    border-top: 1px solid $gray-300;

    &__title {
      @include headline-24;

      color: $gray-600;
    }

    &__grid {
      display: grid;
      grid-auto-rows: 37.7rem;
      grid-template-columns: repeat(3, minmax(0, 360px));
      gap: 2.4rem;
      margin-top: 2.4rem;

      @media (max-width: $media-md) {
        grid-template-columns: repeat(2, minmax(0, 360px));
      }

      @media (max-width: $media-sm) {
        grid-template-columns: 288px;
        justify-content: center;
      }
    }

    &__skeleton {
      width: 100%;
      height: 100%;
      background-color: $gray-100;
      border-radius: $border-radius-md;
    }

    &__no-content {
      margin-top: 4rem;
    }
  }
}
</style>
