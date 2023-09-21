<script setup lang="ts">
import { ref, watch } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { InterestApiService } from "@/modules/Interest/InterestApiService";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import SearchInput from "@/modules/Main/components/form/SearchInput.vue";
import { InterestTags } from "@/domain/Interest/InterestTags";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useRouter } from "vue-router";
import { appConfig } from "@/appConfig";
import { INTEREST_TAG_MAX_LENGTH, INTEREST_TAG_MIN_LENGTH } from "@/domain/Interest/CInterestTagLength.const";
import { InterestTag } from "@/domain/Interest/InterestTag";

const authStore = useAuthStore();
const router = useRouter();

const interestTags = ref<InterestTags>(new InterestTags());
const queryString = ref<string>("");
const searchTipList = ref<InterestTag[]>([]);
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>("");

const fetchData = async (): Promise<void> => {
  interestTags.value.tagList = await ServiceLocator.instance.getService(InterestApiService).getOwnTags();
};

const fetchSearchData = async (): Promise<void> => {
  searchTipList.value = await ServiceLocator.instance.getService(InterestApiService).searchTags(queryString.value);
};

const addTag = (): void => {
  if (queryString.value.length < INTEREST_TAG_MIN_LENGTH) {
    errorMessage.value = "Недостаточное количество символов";
    return;
  }

  if (queryString.value.length >= INTEREST_TAG_MAX_LENGTH) {
    return;
  }

  interestTags.value.addTag({ tag: queryString.value });
  resetSearch();
};

const removeTag = (index: number): void => {
  interestTags.value.removeTag(index);
};

const inputQueryString = (newString: string): void => {
  queryString.value = newString;

  if (queryString.value.length > 2) {
    fetchSearchData();
  } else {
    searchTipList.value = [];
  }
};

const pickSearchItem = (searchItem: InterestTag): void => {
  interestTags.value.addTag(searchItem);
  resetSearch();
};

const submitSave = async (): Promise<void> => {
  isLoading.value = true;

  await ServiceLocator.instance.getService(InterestApiService).saveTags(interestTags.value.tagList);

  isLoading.value = true;

  router.push({ name: ERouteName.USER, params: { id: authStore.sessionUser?.id } });
};

const resetSearch = (): void => {
  queryString.value = "";
  searchTipList.value = [];
};

watch(
  () => queryString.value,
  (newVal) => {
    if (newVal.length >= INTEREST_TAG_MIN_LENGTH) {
      errorMessage.value = "";
    }

    if (newVal.length >= INTEREST_TAG_MAX_LENGTH) {
      errorMessage.value = `Максимальное количество символов - ${INTEREST_TAG_MAX_LENGTH}`;
    }
  }
);

fetchData();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #header>
      <div class="interest-edit-page__header hide-mobile">
        <BaseButton :is-loading="isLoading" @click="submitSave">Сохранить</BaseButton>
      </div>

      <div class="only-mobile">
        <LayoutHeader />
      </div>
    </template>

    <template #content>
      <main class="interest-edit-page page">
        <h1 class="page-title">Интересы</h1>

        <div class="interest-edit-page__wrapper">
          <div class="interest-edit-page__description">
            Добавляй свои интересы, чтобы находить людей по увлечениям.<br />
            Максимально можно добавить {{ appConfig.maxInterests }} интересов.
          </div>

          <div v-if="interestTags.tagList.length" class="interest-edit-page__tag-list">
            <BaseTag
              v-for="(item, index) in interestTags.tagList"
              :key="`tag-${index}`"
              class="interest-edit-page__tag"
              is-removable
              theme="light"
              size="large"
              @remove="removeTag(index)"
            >
              {{ item.tag }}
            </BaseTag>
          </div>

          <div class="interest-edit-search">
            <SearchInput
              :model-value="queryString"
              class="interest-edit-search__input"
              size="large"
              :placeholder="interestTags.maxCreatedMessage || 'Введите название интереса'"
              :error-message="errorMessage"
              max-length="50"
              :is-disabled="!!interestTags.maxCreatedMessage"
              @input="inputQueryString"
              @enter="addTag"
            />

            <div v-if="searchTipList.length" class="interest-edit-search__list">
              <div
                v-for="(tip, index) in searchTipList"
                :key="`search-${index}`"
                class="interest-edit-search__item"
                @click="pickSearchItem(tip)"
              >
                <span class="interest-edit-search__item-title"> {{ tip.tag }}</span>
                <span class="interest-edit-search__item-count"> ({{ tip.count }})</span>
              </div>
            </div>
          </div>
        </div>

        <BaseButton
          class="interest-edit-page__mobile-submit only-mobile-flex"
          :is-loading="isLoading"
          is-full-width
          @click="submitSave"
          >Сохранить</BaseButton
        >
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.interest-edit-page {
  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 3.2rem 0;
  }

  &__wrapper {
    max-width: 57rem;
  }

  &__description {
    @include body-14;

    margin-top: 1.6rem;
    color: $gray-700;
  }

  &__tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 3.2rem;
  }

  &__mobile-submit {
    margin-top: 4.8rem;
  }

  .interest-edit-search {
    &__input {
      margin-top: 2rem;
    }

    &__list {
      @include custom-scrollbar;

      max-height: 30rem;
      margin-top: 1.2rem;
      overflow: auto;
      border-radius: $border-radius-md;
      box-shadow: $box-shadow-soft;
    }

    &__item {
      @include body-16;

      display: flex;
      align-items: center;
      padding: 1.6rem;
      cursor: pointer;
    }

    &__item-title {
      color: $gray-800;
    }

    &__item-count {
      margin-left: 0.8rem;
      color: $gray-500;
    }
  }
}
</style>
