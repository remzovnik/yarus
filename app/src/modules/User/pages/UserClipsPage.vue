<script setup lang="ts">
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, inject, onBeforeUnmount, onMounted, ref } from "vue";
import UserApiService from "../UserApiService";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ClipCard from "@/modules/Clips/components/ClipCard.vue";
import { useClipStore } from "@/modules/Clips/stores/ClipStore";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import CardClipSkeleton from "@/modules/Clips/components/ClipCardSkeleton.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { ClipOriginModel } from "@/modules/Clips/models/ClipOriginModel";
import { eventsConfig } from "@/appConfig";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import UserContentHeader from "@/modules/User/components/UserContentHeader.vue";
import { isClipGuard } from "@/domain/Clip/ClipGuard";
import { TContentCard } from "@/domain/Content/TContentCard.type";
import { Id } from "@/_core/Base.type";

const authStore = useAuthStore();
const props = defineProps<{ id: string }>();
const emitter: any = inject("emitter");
const clipStore = useClipStore();

const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const clipList = ref<TContentCard[]>([]);
const pagination = ref(new PaginationModel());
const isProfileLoading = ref(true);
const isLoading = ref(true);
const noMoreContent = ref(false);

const isMyAccount = computed<boolean>(() => {
  return authStore.isMyAccount(props.id);
});

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  isProfileLoading.value = false;
};

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  pagination.value.currentPage = clipStore.paginationPage;

  let chunk: TContentCard[];
  if (isMyAccount.value) {
    chunk = await ServiceLocator.instance.getService(UserApiService).getMyClips(pagination.value);
  } else {
    chunk = await ServiceLocator.instance.getService(UserApiService).getUserClips(props.id, pagination.value);
  }

  if (!chunk.length) {
    noMoreContent.value = true;
    return;
  }

  pagination.value.currentPage++;
  clipList.value = [...clipList.value, ...chunk];

  clipStore.paginationPage = pagination.value.currentPage;

  //TODO: Переписать клипы на работу с Clip вместо ClipModel и внедрить следующее
  //chunk.forEach((item) => {
  //   if (isClipGuard(item.model)) {
  //     clipStore.userClipList.push(item.model);
  //   }
  // });
  //вместо этого
  clipStore.userClipList = clipList.value as ClipModel[];
  isLoading.value = false;
};

const getClipOrigin = (id: number): ClipOriginModel => {
  return { type: "user", id: id };
};

const editClipHandler = (): void => {
  isProfileLoading.value = true;
  isLoading.value = true;
  noMoreContent.value = false;
  clipList.value = [];
  clipStore.userClipList = [];
  clipStore.paginationPage = 0;
  pagination.value = new PaginationModel();

  fetchData();
};

const deleteClipHandler = (id: Id): void => {
  clipList.value = clipList.value.filter((item) => isClipGuard(item) && item.id !== id);
};

onMounted(async () => {
  clipStore.userClipList = [];
  clipStore.paginationPage = 0;
  await Promise.all([fetchData(), loadDataChunk()]);
  emitter.on(eventsConfig.clipCreate, editClipHandler);
  emitter.on(eventsConfig.clipEdit, editClipHandler);
  emitter.on(eventsConfig.clipDelete, deleteClipHandler);
});

onBeforeUnmount(() => {
  emitter.off(eventsConfig.clipCreate, editClipHandler);
  emitter.off(eventsConfig.clipEdit, editClipHandler);
  emitter.off(eventsConfig.clipDelete, deleteClipHandler);
});
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-clips-page page">
        <UserContentHeader>
          <template #profile>
            <!-- TODO: check name -->
            <ProfileHeader v-if="!isProfileLoading" :type="EActionContentType.USER_CONTENT" name="Сюжеты" :model="userModel" />
            <SkeletonProfileHeader v-else />
          </template>

          <template #button>
            <BaseButton v-if="isMyAccount" type="secondary" size="large" icon="plus" :route="{ name: 'clip-create' }"
              >Добавить новый сюжет</BaseButton
            >
          </template>
        </UserContentHeader>

        <!-- TODO: Разобраться с origin и внедрить BaseGrid -->
        <template v-if="clipList.length && !isProfileLoading">
          <div class="user-clips-page__grid clips-group__grid">
            <div v-for="(item, index) in clipList" :key="`clip-${isClipGuard(item) ? item.id : index}`" class="clips-group__cell">
              <ClipCard v-if="isClipGuard(item)" :model="item" :origin="getClipOrigin(userModel.id)" />
            </div>
          </div>
          <BaseInfiniteScroll v-if="!noMoreContent" @on-intersect="loadDataChunk" />
        </template>

        <div v-else-if="noMoreContent" class="user-clips-page-empty">
          <NoContent class="user-clips-page-empty__no-content" title="Здесь ничего нет 😢">
            {{ isMyAccount ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал" }}
          </NoContent>
          <div v-if="isMyAccount" class="user-clips-page-empty__no-content-controls">
            <BaseButton size="large" type="primary" :route="{ name: ERouteName.CLIP_CREATE }"> + Создать </BaseButton>
          </div>
        </div>

        <div v-else-if="!noMoreContent" class="user-clips-page__skeleton-grid common-grid common-grid_type_clips">
          <div v-for="index in pagination.perPage" :key="index" class="common-grid__cell">
            <CardClipSkeleton />
          </div>
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.user-clips-page {
  display: flex;
  flex-direction: column;

  &__grid {
    margin-top: 2.4rem;

    @media (max-width: $media-sm) {
      margin-top: 1.6rem;
    }
  }

  &__skeleton-grid {
    margin-top: 1.6rem;
  }
}

.user-clips-page-empty {
  &__no-content {
    margin-top: 15%;
  }

  &__no-content-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2.4rem;
  }
}
</style>
