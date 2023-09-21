<script lang="ts" setup>
import { ref, computed, inject, onBeforeUnmount } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { YarusApiService } from "@/modules/Yarus/YarusApiService";
import YarusCard from "@/modules/Yarus/components/YarusCard.vue";
import YarusCardSkeleton from "@/modules/Yarus/components/YarusCardSkeleton.vue";
import YarusModel from "@/modules/Yarus/models/YarusModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import NoContent from "@/modules/Main/components/NoContent.vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { eventsConfig } from "@/appConfig";
import Seo from "@/modules/Seo/components/Seo.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";

const emitter: any = inject("emitter");

const yarusList = ref<YarusModel[]>([]);
const isLoading = ref(true);
const isLoaded = ref(false);
const pagination = ref(new PaginationModel());

const createRoute = computed<RouteModel>(() => {
  return { name: "yarus-create" };
});

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(YarusApiService).getYarusList(pagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  pagination.value.currentPage++;
  yarusList.value = [...yarusList.value, ...chunk];
  isLoading.value = false;
};

const deleteYarusHandler = (id): void => {
  yarusList.value = yarusList.value.filter((item) => item.id !== id);
};

emitter.on(eventsConfig.yarusDelete, deleteYarusHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.yarusDelete, deleteYarusHandler);
});
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="yarus-page page">
        <header class="yarus-page__header">
          <h1 class="page-title">Мои ярусы</h1>

          <BaseButton v-if="yarusList.length" class="hide-mobile" size="large" type="secondary" icon="plus" :route="createRoute">
            Создать новый ярус
          </BaseButton>
          <BaseButton v-if="yarusList.length" class="only-mobile" type="secondary" icon="plus" :route="createRoute" />
        </header>

        <div v-for="(item, index) in yarusList" :key="index" class="yarus-page__list">
          <YarusCard :model="item" />
        </div>

        <template v-if="isLoading">
          <div v-for="index in 5" :key="`skeleton-${index}`">
            <YarusCardSkeleton />
          </div>
        </template>

        <BaseInfiniteScroll v-if="!isLoaded" @on-intersect="loadDataChunk" />

        <NoContent
          v-if="isLoaded && !yarusList.length"
          class="yarus-page__no-content"
          title="Вы пока не создали ни одного яруса"
          :route="createRoute"
          button-text="Создать новый ярус"
          button-icon="plus"
        >
          Персональные ярусы — это способ собрать интересные новости, публикации, видео и события в единую ленту
        </NoContent>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.yarus-page {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
