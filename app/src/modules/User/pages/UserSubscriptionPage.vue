<script setup lang="ts">
import { ref } from "vue";
import { User } from "@/domain/User/User";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import UserApiService from "../UserApiService";
import ProfileHeader from "@/modules/Main/components/profile/ProfileHeader.vue";
import UserSubscription from "../components/UserSubscription.vue";
import SkeletonProfileHeader from "@/modules/Main/components/SkeletonProfileHeader.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";

const props = defineProps<{ id: string }>();

const userModel = ref<User>(ServiceLocator.factory.user.createDefault());
const isLoading = ref(true);

const fetchData = async (): Promise<void> => {
  userModel.value = await ServiceLocator.instance.getService(UserApiService).getUserInfo(props.id);
  isLoading.value = false;
};

fetchData();
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #content>
      <main class="user-subscription-page page">
        <ProfileHeader
          v-if="!isLoading"
          class="user-page__profile-header"
          :type="EActionContentType.USER"
          :model="userModel"
          :name="`${userModel.name} ${userModel.surname}`"
        />
        <SkeletonProfileHeader v-else />
        <UserSubscription :id="+id" />
      </main>
    </template>
  </LayoutBase>
</template>
