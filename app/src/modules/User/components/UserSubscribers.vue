<script setup lang="ts">
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import UserApiService from "@/modules/User/UserApiService";
import { ref } from "vue";
import { User } from "@/domain/User/User";
import { PaginationModel } from "@/_core/models/PaginationModel";
import UserCard from "@/modules/User/components/UserCard/UserCard.vue";
import UserCardSkeleton from "@/modules/User/components/UserCardSkeleton.vue";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";

const props = defineProps<{
  id: number;
}>();

const isLoading = ref(false);
const isLoaded = ref(false);
const usersList = ref<User[]>([]);
const usersPagination = ref(new PaginationModel());

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;
  const chunk = await ServiceLocator.instance.getService(UserApiService).getUserFollowersList(props.id, usersPagination.value);

  if (!chunk.length) {
    isLoaded.value = true;
    isLoading.value = false;
    return;
  }
  usersPagination.value.currentPage++;
  usersList.value = [...usersList.value, ...chunk];
  isLoading.value = false;
};
</script>

<template>
  <div class="user-subscribers">
    <div v-if="usersList.length">
      <UserCard v-for="(card, index) in usersList" :key="index" :model="card">
        <ButtonSubscribe
          :id="+card.id"
          :is-subscribed="card.isSubscribe"
          :type="ESubscribeType.USER"
          size="large"
          :is-tablet-immutable="true"
        />
      </UserCard>
    </div>

    <template v-if="isLoading">
      <UserCardSkeleton v-for="index in 21" :key="`user-short-card-${index}`" />
    </template>

    <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadDataChunk" />
  </div>
</template>

<style lang="scss">
.user-subscribers {
  margin-top: 3.2rem;
}
</style>
