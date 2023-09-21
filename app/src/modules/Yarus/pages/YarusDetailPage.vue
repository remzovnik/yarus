<script lang="ts" setup>
import { ref, computed, onBeforeUnmount, inject, Ref, watchEffect } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { YarusApiService } from "@/modules/Yarus/YarusApiService";
import YarusModel from "@/modules/Yarus/models/YarusModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import NoContent from "@/modules/Main/components/NoContent.vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { useRouter } from "vue-router";
import { EventPreview } from "@/domain/Event/EventPreview";
import { NewsPreview } from "@/domain/News/NewsPreview";
import YarusHeaderSkeleton from "@/modules/Yarus/components/YarusHeaderSkeleton.vue";
import { appConfig, eventsConfig } from "@/appConfig";
import { useBreakpoints } from "@vueuse/core";
import { useYarusStore } from "@/modules/Yarus/stores/YarusStore";
import Seo from "@/modules/Seo/components/Seo.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import BaseGrid from "@/modules/Base/components/BaseGrid/BaseGrid.vue";
import LayoutList from "@/modules/Main/components/layouts/LayoutList.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { Video } from "@/domain/Video/Video";
import { Post } from "@/domain/Post/Post";

const emitter: any = inject("emitter");

const router = useRouter();
const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile, tablet: appConfig.widthTablet });
const yarusStore = useYarusStore();

const props = defineProps<{ id: string }>();

const isMobile: Ref<boolean> = breakpoints.smaller("mobile");
const isTablet: Ref<boolean> = breakpoints.between("mobile", "tablet");

const yarusInfo = ref(new YarusModel());

const pagination = ref(new PaginationModel());
const contentList = ref<TContentCard[]>([]);
const nameBlock = ref<HTMLDivElement>();
const showNameBelow = ref<boolean>(false);
const linesMoreThenOne = ref<boolean>(false);
const isInfoLoading = ref<boolean>(true);
const isContentLoading = ref<boolean>(true);
const isContentLoaded = ref<boolean>(false);

const lineHeightValues = {
  mobile: 26,
  tablet: 34,
  desktop: 42,
};

const loadContent = async (isLoadInfo: boolean = true): Promise<void> => {
  isContentLoading.value = true;
  isInfoLoading.value = isLoadInfo;
  const accessToken = ServiceLocator.instance.getService(AuthApiService).accessToken;
  const refreshToken = ServiceLocator.instance.getService(AuthApiService).refreshToken;
  if (!accessToken && !!refreshToken) {
    await ServiceLocator.instance.getService(AuthApiService).updateExpiredAccessToken();
  }
  if (!accessToken && !refreshToken) {
    await router.push(ERouteName.AUTH);
    return;
  }
  if (isLoadInfo) {
    await Promise.all([loadInfo(), loadDataChunk()]);
  } else {
    await loadDataChunk();
  }
  isContentLoading.value = false;
  isInfoLoading.value = false;
};

const loadDataChunk = async (): Promise<void> => {
  const chunk = await ServiceLocator.instance.getService(YarusApiService).getYarusContent(props.id, pagination.value);

  if (!chunk.length) {
    isContentLoaded.value = true;
    return;
  }

  contentList.value = [...contentList.value, ...chunk];

  pagination.value.currentPage++;

  pagination.value.beforeTimestamp =
    (chunk[chunk.length - 1] as Video | NewsPreview | Post)?.createDate || (chunk[chunk.length - 1] as EventPreview)?.createdAt;
};

const loadInfo = async (): Promise<void> => {
  yarusInfo.value = await ServiceLocator.instance.getService(YarusApiService).getYarus(props.id);
};

const deleteYarusHandler = (): void => {
  const routeQuery: RouteModel = { name: ERouteName.YARUS };

  router.push(routeQuery);
};

const openEditYarusPage = (): void => {
  yarusStore.isEditing = true;
  yarusStore.id = +props.id;
  const route: RouteModel = { name: ERouteName.YARUS_CREATE };
  router.push(route);
};

loadContent();
emitter.on(eventsConfig.yarusDelete, deleteYarusHandler);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.yarusDelete, deleteYarusHandler);
});

const classes = computed<StyleClasses>(() => {
  return {
    "yarus-detail__header_large": linesMoreThenOne.value,
  };
});

watchEffect(() => {
  const lineHeight = isMobile.value
    ? lineHeightValues.mobile
    : isTablet.value
    ? lineHeightValues.tablet
    : lineHeightValues.desktop;
  if (nameBlock.value) {
    const blockHeight = nameBlock.value.getBoundingClientRect().height;
    linesMoreThenOne.value = blockHeight > lineHeight;
    showNameBelow.value = blockHeight >= lineHeight * 2 && isMobile.value;
  }
});
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="yarus-detail page">
        <LayoutList>
          <template #header>
            <header v-if="!isInfoLoading" class="yarus-detail__header" :class="classes">
              <div class="yarus-detail__header-text">
                <BaseAvatar :size="80" :image="yarusInfo.image || yarusInfo.icon?.image" class="yarus-detail__avatar" />
                <h1 v-show="!showNameBelow" ref="nameBlock" class="yarus-detail__title">
                  {{ yarusInfo.name }}
                </h1>
              </div>

              <div class="yarus-detail__actions">
                <VDropdown :skidding="-48">
                  <BaseButton type="secondary" size="large" icon="dots-vertical" />
                  <template #popper="{ hide }">
                    <ActionsMenu :target-id="yarusInfo.id" :type="EActionContentType.YARUS" @click="hide" />
                  </template>
                </VDropdown>
              </div>

              <h1 v-show="showNameBelow" class="yarus-detail__title yarus-detail__title_below">
                {{ yarusInfo.name }}
              </h1>
            </header>

            <YarusHeaderSkeleton v-else />
          </template>
          <template #list>
            <BaseGrid
              :list="contentList"
              :is-loading="isContentLoading"
              :is-loaded="isContentLoaded"
              clip-origin="bloggers"
              @load="loadDataChunk"
            >
              <template #empty>
                <NoContent
                  v-if="isContentLoaded && !contentList.length"
                  class="interest-detail__no-content"
                  title="По вашим интересам ничего не найдено"
                >
                  Попробуйте подобрать другие интересы
                </NoContent>
              </template>
            </BaseGrid>

            <BaseButton
              v-if="isContentLoaded && !contentList.length"
              class="yarus-detail__edit-btn"
              size="large"
              aria-label="Создать контент"
              @click="openEditYarusPage"
              >Редактировать ярус</BaseButton
            >
          </template>
        </LayoutList>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.yarus-detail {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 2.4rem;
    border-bottom: 1px solid $gray-300;

    @media (max-width: $media-md) {
      padding-bottom: 1.6rem;
    }

    &_large {
      flex-wrap: wrap;
      align-items: start;
    }

    &_large .yarus-detail__header-text {
      align-items: start;
    }

    &_large .yarus-detail__title {
      margin-top: 0.8rem;
    }
  }

  &__header-text {
    display: flex;
    align-items: center;
    width: calc(100% - 4.8rem - 1.6rem);
  }

  &__title {
    @include headline-32;

    margin-left: 1.6rem;

    @media (max-width: $media-md) {
      @include headline-24;
    }

    @media (max-width: $media-sm) {
      @include headline-18;
    }

    &_below {
      margin-left: 0;
    }
  }

  &__grid {
    margin-top: 5.6rem;

    @media (max-width: $media-sm) {
      margin-top: 3.2rem;
    }
  }

  &__skeleton {
    margin-top: 2.4rem;
  }

  &__no-content {
    margin-top: 14.2rem;
  }

  &__edit-btn {
    margin: 2.4rem auto 0;
  }
}
</style>
