<script setup lang="ts">
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { inject, onBeforeUnmount, ref, onMounted } from "vue";
import UserApiService from "../UserApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { eventsConfig } from "@/appConfig";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import UserContentHeader from "@/modules/User/components/UserContentHeader.vue";
import { isPhotoGuard } from "@/domain/Photo/Photo.guard";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const authStore = useAuthStore();
const emitter: any = inject("emitter");
const props = defineProps<{ id: string }>();

const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const list = ref<TContentCard[]>([]);
const pagination = ref<PaginationModel>(new PaginationModel());
const isProfileLoading = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  isProfileLoading.value = false;
};

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = await ServiceLocator.instance.getService(UserApiService).getUserPhoto(props.id, pagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  list.value = [...list.value, ...chunk];
  pagination.value.currentPage++;

  isLoading.value = false;
};

const editPhotoHandler = (): void => {
  isProfileLoading.value = true;
  isLoading.value = true;
  isLoaded.value = false;
  list.value = [];
  pagination.value = new PaginationModel();

  fetchData();
  loadDataChunk();
};

const deletePhotoHandler = (id): void => {
  list.value = list.value.filter((item) => isPhotoGuard(item) && item.id !== id);
};

onMounted(async () => {
  await Promise.all([fetchData(), loadDataChunk()]);

  emitter.on(eventsConfig.postCreate, editPhotoHandler);
  emitter.on(eventsConfig.postEdit, editPhotoHandler);
  emitter.on(eventsConfig.postDelete, deletePhotoHandler);
});

onBeforeUnmount(() => {
  emitter.off(eventsConfig.postCreate, editPhotoHandler);
  emitter.off(eventsConfig.postEdit, editPhotoHandler);
  emitter.off(eventsConfig.postDelete, deletePhotoHandler);
});
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-photos-page page">
        <LayoutList>
          <template #header>
            <UserContentHeader>
              <template #profile>
                <ProfileHeader v-if="!isProfileLoading" :type="EActionContentType.USER_CONTENT" :model="userModel" name="Фото" />
                <SkeletonProfileHeader v-else />
              </template>

              <template #button>
                <BaseButton
                  v-if="authStore.isMyAccount(id)"
                  type="secondary"
                  size="large"
                  icon="plus"
                  :route="{ name: 'photo-create' }"
                  >Добавить новое фото</BaseButton
                >
              </template>
            </UserContentHeader>
          </template>

          <template #list>
            <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk">
              <template #empty>
                <NoContent class="user-photos-page-empty__no-content" title="Здесь ничего нет 😢">
                  {{ authStore.isMyAccount(userModel.id) ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал" }}
                </NoContent>
                <div v-if="authStore.isMyAccount(userModel.id)" class="user-photos-page-empty__no-content-controls">
                  <BaseButton size="large" type="primary" :route="{ name: ERouteName.PHOTO_CREATE }"> + Создать </BaseButton>
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
.user-photos-page {
  display: flex;
  flex-direction: column;
}

.user-photos-page-empty {
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
