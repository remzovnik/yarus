<script setup lang="ts">
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { computed, inject, onBeforeUnmount, ref, onMounted } from "vue";
import UserApiService from "../UserApiService";
import VideoModel from "@/modules/Video/models/VideoModel";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { eventsConfig } from "@/appConfig";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import UserContentHeader from "@/modules/User/components/UserContentHeader.vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import LayoutList from "@/modules/Main/components/layouts/LayoutList.vue";

const authStore = useAuthStore();
const emitter: any = inject("emitter");
const props = defineProps<{ id: string }>();

const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const list = ref<VideoModel[]>([]);
const pagination = ref(new PaginationModel());
const isProfileLoading = ref(true);
const isLoading = ref(true);
const isLoaded = ref(false);

const isMyAccount = computed<boolean>(() => {
  return authStore.isMyAccount(props.id);
});

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  isProfileLoading.value = false;
};

const loadDataChunk = async () => {
  isLoading.value = true;

  let chunk;
  if (isMyAccount.value) {
    chunk = await ServiceLocator.instance.getService(UserApiService).getMyVideos(pagination.value);
  } else {
    chunk = await ServiceLocator.instance.getService(UserApiService).getUserVideos(props.id, pagination.value);
  }

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  list.value = [...list.value, ...chunk];

  pagination.value.currentPage++;

  isLoading.value = false;
};

const editVideoHandler = (): void => {
  isLoading.value = true;
  isLoaded.value = false;
  list.value = [];
  pagination.value = new PaginationModel();

  loadDataChunk();
};

const deleteVideoHandler = (id) => {
  list.value = list.value.filter((item) => item.id !== id);
};

onMounted(async () => {
  await Promise.all([fetchData(), loadDataChunk()]);

  emitter.on(eventsConfig.videoCreate, editVideoHandler);
  emitter.on(eventsConfig.videoEdit, editVideoHandler);
  emitter.on(eventsConfig.videoDelete, deleteVideoHandler);
});

onBeforeUnmount(() => {
  emitter.off(eventsConfig.videoCreate, editVideoHandler);
  emitter.off(eventsConfig.videoEdit, editVideoHandler);
  emitter.off(eventsConfig.videoDelete, deleteVideoHandler);
});
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-videos-page page">
        <LayoutList>
          <template #header>
            <UserContentHeader>
              <template #profile>
                <ProfileHeader v-if="!isProfileLoading" :type="EActionContentType.USER_CONTENT" name="Видео" :model="userModel" />
                <SkeletonProfileHeader v-else />
              </template>

              <template #button>
                <BaseButton
                  v-if="authStore.isMyAccount(id)"
                  type="secondary"
                  size="large"
                  icon="plus"
                  :route="{ name: 'video-create' }"
                  >Добавить новое видео</BaseButton
                >
              </template>
            </UserContentHeader>
          </template>

          <template #list>
            <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk">
              <template #empty>
                <NoContent class="user-videos-page-empty__no-content" title="Здесь ничего нет 😢">
                  {{ authStore.isMyAccount(userModel.id) ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал" }}
                </NoContent>
                <div v-if="authStore.isMyAccount(userModel.id)" class="user-videos-page-empty__no-content-controls">
                  <BaseButton size="large" type="primary" :route="{ name: ERouteName.VIDEO_CREATE }"> + Создать </BaseButton>
                </div>
              </template>
            </BaseGrid>
          </template>
        </LayoutList>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.user-videos-page {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $gray-300;

    @media (max-width: $media-sm) {
      flex-direction: column;
      align-items: flex-start;
      border: none;
    }

    .profile-header {
      padding-bottom: 2.4rem;
      border: none;

      @media (max-width: $media-sm) {
        width: 100%;
        padding-bottom: 1.6rem;
        border-bottom: 1px solid $gray-300;
      }
    }
  }

  &__create-btn {
    @media (max-width: $media-sm) {
      margin-top: 3.2rem;
    }
  }
}

.user-videos-page-empty {
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
