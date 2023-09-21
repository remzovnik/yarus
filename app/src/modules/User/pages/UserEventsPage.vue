<script setup lang="ts">
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ref } from "vue";
import UserApiService from "../UserApiService";
import { PaginationModel } from "@/_core/models/PaginationModel";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import UserContentHeader from "@/modules/User/components/UserContentHeader.vue";
import { TContentCard } from "@/domain/Content/TContentCard.type";

const authStore = useAuthStore();
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

  const chunk = await ServiceLocator.instance.getService(UserApiService).getUserEvents(props.id, pagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
    return;
  }

  pagination.value.currentPage++;
  list.value = [...list.value, ...chunk];
  isLoading.value = false;
};

fetchData();
loadDataChunk();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-events-page page">
        <LayoutList>
          <template #header>
            <UserContentHeader>
              <template #profile>
                <ProfileHeader
                  v-if="!isProfileLoading"
                  :type="EActionContentType.USER_CONTENT"
                  name="События"
                  :model="userModel"
                />
                <SkeletonProfileHeader v-else />
              </template>

              <template #button>
                <BaseButton
                  v-if="authStore.isMyAccount(id)"
                  type="secondary"
                  size="large"
                  icon="plus"
                  :route="{ name: 'event-create' }"
                  >Добавить новое событие</BaseButton
                >
              </template>
            </UserContentHeader>
          </template>

          <template #list>
            <BaseGrid :list="list" :is-loading="isLoading" :is-loaded="isLoaded" @load="loadDataChunk">
              <template #empty>
                <NoContent class="user-events-page-empty__no-content" title="Здесь ничего нет 😢">
                  {{ authStore.isMyAccount(userModel.id) ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал" }}
                </NoContent>
                <div v-if="authStore.isMyAccount(userModel.id)" class="user-events-page-empty__no-content-controls">
                  <BaseButton size="large" type="primary" :route="{ name: ERouteName.EVENT_CREATE }"> + Создать </BaseButton>
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
.user-events-page {
  display: flex;
  flex-direction: column;
}

.user-events-page-empty {
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
