<script setup lang="ts">
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import HashtagApiService from "../apiService/HashtagApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import SeoHashtag from "@/modules/Seo/components/SeoHashtag.vue";
import { useRouter } from "vue-router";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";

const router = useRouter();
const props = defineProps<{ id: string }>();

const isStatusLoaded = ref(false);
const isSubscribe = ref(false);
const isLoading = ref(true);
const isLoaded = ref(false);
const pagination = ref(new PaginationModel());
const list = ref<TContentCard[]>([]);

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(HashtagApiService).getHashtagContent(props.id, pagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  list.value = [...list.value, ...chunk];

  pagination.value.currentPage++;

  isLoading.value = false;

  if (!list.value.length) {
    await router.replace({ name: ERouteName.ERROR_NOT_FOUND });
  }
};

const loadStatus = async (): Promise<void> => {
  const result = await ServiceLocator.instance.getService(HashtagApiService).getHashtagStatus(props.id);
  isSubscribe.value = !!result.status;

  isStatusLoaded.value = true;
};

loadStatus();
loadDataChunk();
</script>

<template>
  <SeoHashtag :id="id" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="hashtag-page">
        <LayoutList>
          <template #header>
            <div class="hashtag-page__header">
              <h1 class="hashtag-page__title page-title">#{{ id }}</h1>
              <ButtonSubscribe
                v-if="isStatusLoaded"
                :id="id"
                :is-subscribed="isSubscribe"
                :type="ESubscribeType.HASHTAG"
                size="large"
                :is-always-secondary="true"
                :is-mobile-immutable="true"
                :is-tablet-immutable="true"
              />
            </div>
          </template>

          <template #list>
            <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" clip-origin="bloggers" @load="loadDataChunk" />
          </template>
        </LayoutList>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.hashtag-page {
  @media (max-width: $media-sm) {
    .button-subscribe {
      width: 100%;
      margin-top: 1.2rem;

      .base-button {
        width: 100%;
      }
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: $media-sm) {
      flex-direction: column;
    }
  }

  &__title {
    @include overflow-ellipsis;

    @media (max-width: $media-sm) {
      width: 100%;
    }
  }
}
</style>
