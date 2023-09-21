<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import UserApiService from "@/modules/User/UserApiService";
import { User } from "@/domain/User/User";
import { PaginationModel } from "@/_core/models/PaginationModel";
import UserCard from "@/modules/User/components/UserCard/UserCard.vue";
import { EUserCardType } from "@/modules/User/components/UserCard/EUserCardType.eum";
import SearchInput from "@/modules/Main/components/form/SearchInput.vue";
import SearchService from "@/modules/Search/SearchService";
import NoContent from "@/modules/Main/components/NoContent.vue";
import UserCardSkeleton from "@/modules/User/components/UserCardSkeleton.vue";
import { IFeedInvitation } from "@/domain/Feed/IFeedInviteList.interface";
import { appConfig } from "@/appConfig";
import { EFeedInviteStatus } from "@/domain/Feed/EFeedInviteStatus.enum";

const emit = defineEmits<{
  (event: "submitInvite", payload: User[]): void;
}>();

const authStore = useAuthStore();

const props = defineProps<{
  inviteList: User[];
  previouslyInvitedList: IFeedInvitation[];
}>();

const isLoading = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const userList = ref<User[]>([]);
const pagination = ref<PaginationModel>(new PaginationModel());

const selectedUserList = ref<User[]>([]);
const currentSearchString = ref<string>("");

const loadDataChunk = async (): Promise<void> => {
  isLoading.value = true;

  const chunk = !!currentSearchString.value ? await getUsersSearchChunk() : await getUserFollowersChunk();

  if (!chunk.length) {
    isLoaded.value = true;
    isLoading.value = false;
    return;
  }

  pagination.value.currentPage++;
  userList.value = [...userList.value, ...chunk];
  isLoading.value = false;
};

const getUserFollowersChunk = async (): Promise<User[]> => {
  return authStore.sessionUser
    ? await ServiceLocator.instance.getService(UserApiService).getUserFollowersList(authStore.sessionUser.id, pagination.value)
    : [];
};

const getUsersSearchChunk = async (): Promise<User[]> => {
  return await ServiceLocator.instance
    .getService(SearchService)
    .getSearchResultByUsers(currentSearchString.value, pagination.value);
};

const toggleUserSelection = (isChecked: boolean, user: User): void => {
  if (isChecked) {
    selectedUserList.value = [...selectedUserList.value, user];
  } else {
    selectedUserList.value = selectedUserList.value.filter((item) => item.id !== user.id);
  }
};

const searchUsers = async (searchString: string): Promise<void> => {
  currentSearchString.value = searchString;
  resetPagination();
  loadDataChunk();
};

const resetSearch = (): void => {
  currentSearchString.value = "";
  resetPagination();
  loadDataChunk();
};

//TODO: сброс частично вынести в сервис Pagination
const resetPagination = (): void => {
  pagination.value.currentPage = 0;
  isLoaded.value = false;
  userList.value = [];
};

const submitInvite = (): void => {
  emit("submitInvite", selectedUserList.value);
};

const isUserInvited = (checkingUser: User): boolean => {
  return !!selectedUserList.value.find((item) => checkingUser.id === item.id);
};

const isCheckboxHidden = (checkingUser: User): boolean => {
  if (props.previouslyInvitedList) {
    return !!props.previouslyInvitedList?.find(
      (invite) => invite.user.id === checkingUser.id && invite.status !== EFeedInviteStatus.ACCEPTED
    );
  }

  return false;
};

const currentMaxInvited = computed<number>(() => {
  if (props.previouslyInvitedList) {
    return appConfig.defaultMaxInvitedFeedCount - props.previouslyInvitedList?.length;
  }

  return appConfig.defaultMaxInvitedFeedCount;
});

onMounted(async () => {
  if (props.inviteList) {
    selectedUserList.value = props.inviteList;
  }
});
</script>

<template>
  <div class="feed-invite">
    <div class="feed-invite-followers">
      <SearchInput placeholder="Кого пригласить?" @keyup.stop @change="searchUsers" @clear="resetSearch" />

      <div class="feed-invite-followers__subtitle">
        {{ !!currentSearchString ? "Глобальный поиск" : "Мои подписчики" }}
      </div>

      <div class="feed-invite-followers__list">
        <div v-if="userList.length">
          <UserCard
            v-for="userCard in userList"
            :key="userCard.id"
            :model="userCard"
            :type="EUserCardType.FOLLOWER"
            is-link-disabled
          >
            <BaseCheckbox
              v-if="!isCheckboxHidden(userCard)"
              :is-checked="isUserInvited(userCard)"
              @change="toggleUserSelection($event, userCard)"
            />
          </UserCard>
        </div>

        <template v-if="isLoading">
          <UserCardSkeleton v-for="index in 6" :key="`skeleton-${index}`" />
        </template>

        <NoContent
          v-if="isLoaded && !userList.length"
          is-small
          image="/images/no_content_small.svg"
          :title="currentSearchString ? 'Никто не найден' : 'У вас нет подписчиков'"
        >
          {{ currentSearchString ? "Попробуйте ввести другой запрос" : "Попробуйте найти кого-то в поиске" }}
        </NoContent>

        <BaseInfiniteScroll v-if="!isLoaded && !isLoading" @on-intersect="loadDataChunk" />
      </div>
    </div>

    <BaseButton
      class="feed-invite__submit"
      is-full-width
      :is-disabled="selectedUserList.length > currentMaxInvited"
      @click="submitInvite"
    >
      Продолжить
    </BaseButton>

    <div class="feed-invite__status">
      <template v-if="selectedUserList.length <= currentMaxInvited">
        Выбрано {{ selectedUserList.length }}/{{ currentMaxInvited }} участников
      </template>

      <template v-else>
        <BaseIcon name="warning-filled" /> Вы можете приглашать не более {{ currentMaxInvited }} участников в день
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.feed-invite {
  &__submit {
    margin-top: 2rem;
  }

  &__status {
    @include body-14;

    display: flex;
    gap: 0.8rem;
    align-items: center;
    justify-content: center;
    margin-top: 1.2rem;
    color: $gray-700;
  }

  .feed-invite-followers {
    &__subtitle {
      @include body-14;

      margin-top: 2.4rem;
      color: $gray-650;
    }

    &__list {
      @include custom-scrollbar;

      height: 39.6rem;
      margin-top: 1rem;
      overflow-y: scroll;
    }
  }
}
</style>
