<script setup lang="ts">
import { computed, ref } from "vue";
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import UserApiService from "../UserApiService";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import UserSubscribers from "../components/UserSubscribers.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";

const authStore = useAuthStore();
const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const isLoading = ref(true);
const props = defineProps<{ id: string }>();

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  isLoading.value = false;
};

const isMyAccount = computed<boolean>(() => {
  return authStore.isMyAccount(userModel.value.id);
});

const noContentText = computed(() => {
  return isMyAccount.value ? "У вас нет подписчиков" : "У пользователя нет подписчиков";
});
fetchData();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-subscribers-page page">
        <ProfileHeader
          v-if="!isLoading"
          class="user-page__profile-header"
          :type="EActionContentType.USER"
          :model="userModel"
          :name="`${userModel.name} ${userModel.surname}`"
        />
        <SkeletonProfileHeader v-else />

        <UserSubscribers v-if="userModel.countSubscribers" :id="+id" />
        <div v-if="!userModel.countSubscribers && !isLoading" class="user-subscribers-page__no-content account-section__plug">
          <NoContent title="Здесь ничего нет 😢">
            {{ noContentText }}
          </NoContent>
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.user-subscribers-page {
  &__no-content {
    margin-top: 3.2rem;
  }
}
</style>
