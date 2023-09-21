<script lang="ts" setup>
import { ref, computed } from "vue";
import FeedCreate from "@/modules/Feed/components/FeedCreate.vue";
import FeedInvite from "@/modules/Feed/components/FeedInvite.vue";
import { Feed } from "@/domain/Feed/Feed";
import { onMounted } from "vue";
import { PaginationModel } from "@/_core/models/PaginationModel";
import { appConfig } from "@/appConfig";
import FeedApiService from "@/modules/Feed/FeedApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { IFeedInvitation } from "@/domain/Feed/IFeedInviteList.interface";
import { Id } from "@/_core/Base.type";
import { User } from "@/domain/User/User";

const props = defineProps<{
  id?: Id;
}>();

const feedCreate = ref<{ createFeed: () => void }>();
const isFeedCreateValid = ref<boolean>(true);
const isLoading = ref<boolean>(false);
const isInviteActive = ref<boolean>(false);
const inviteList = ref<User[]>([]);
const currentFeed = ref<Feed>(ServiceLocator.factory.feed.createDefault());
const previouslyInvitedList = ref<IFeedInvitation[]>([]);

const loadingHandler = (loadingState: boolean): void => {
  isLoading.value = loadingState;
};

const editFeed = async (resolve, close): Promise<void> => {
  const response = await feedCreate.value?.createFeed();
  if (response) {
    resolve();
    close();
  }
};

const modalTitle = computed<string>(() => {
  if (isInviteActive.value) {
    return "Пригласить участников";
  }

  return props.id ? "Редактировать ленту" : "Создать новую ленту";
});

const submitInvite = (userList: User[]): void => {
  isInviteActive.value = false;
  inviteList.value = userList;
};

const saveEditingFeedModel = (updatedEditingFeedModel: Feed): void => {
  currentFeed.value = updatedEditingFeedModel;
};

onMounted(async () => {
  if (props.id) {
    previouslyInvitedList.value = await ServiceLocator.instance.getService(FeedApiService).getInvites(
      props.id,
      new PaginationModel({
        perPage: appConfig.defaultMaxInvitedFeedCount,
      })
    );
  }
});
</script>

<template>
  <BaseModal
    :title="modalTitle"
    :are-actions-shown="!isInviteActive"
    :submit-button-text="!props.id ? 'Создать' : 'Сохранить'"
    :submit-handler="editFeed"
    :is-submit-disabled="!isFeedCreateValid || isLoading"
    modal-classes="edit-feed-modal"
  >
    <template #content>
      <FeedInvite
        v-show="isInviteActive"
        :previously-invited-list="previouslyInvitedList"
        :invite-list="inviteList"
        @submit-invite="submitInvite"
      />

      <FeedCreate
        v-show="!isInviteActive"
        :id="id"
        ref="feedCreate"
        v-model="isFeedCreateValid"
        :model="currentFeed"
        :invite-list="inviteList"
        is-advanced-mode
        @loading="loadingHandler"
        @init-invite="isInviteActive = true"
        @update-model="saveEditingFeedModel"
      />
    </template>
  </BaseModal>
</template>

<style lang="scss">
.edit-feed-modal {
  .base-modal__content {
    margin-right: 0;
    padding-right: 0;
  }
}
</style>
