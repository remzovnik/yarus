<script lang="ts" setup>
import { dateDiff } from "@/_core/utils/DateUtils";
import UserModel from "@/modules/Main/models/UserModel";

const props = defineProps<{
  user?: UserModel;
  photo: string;
  name: string;
  surname: string;
  createDate?: number;
  isEdited?: boolean;
}>();

const formattedDate = (createDate: number) => {
  return dateDiff(createDate / 1000);
};
</script>

<template>
  <header class="comments-user">
    <div class="comments-user__picture-wrapper">
      <BaseAvatar :image="photo" :size="40" />
    </div>
    <div class="comments-user__rightside">
      <h2 class="comments-user__title" itemprop="author" itemscope itemtype="https://schema.org/Person">
        <span class="comments-user__name">{{ name }} {{ surname }}</span>
        <BaseIcon v-if="user?.approved" class="comments-user__approve-icon" name="verify" :size="16" />
      </h2>
      <div v-if="createDate" class="comments-user__date" itemprop="dateCreated">
        {{ formattedDate(createDate) }}
        <span v-if="isEdited" class="comments-user__edit"> | Изменен </span>
      </div>
    </div>
  </header>
</template>

<style lang="scss">
.comments-user {
  display: flex;
  align-items: center;
  width: 100%;

  &__picture-wrapper {
    width: 4rem;
    height: 4rem;
    margin-right: 1.2rem;
  }

  &__rightside {
    @include overflow-ellipsis;
  }

  &__title {
    @include label-16;

    display: flex;
    align-items: center;
    margin-right: 1rem;
    color: $gray-600;
  }

  &__name {
    @include overflow-ellipsis;

    flex-shrink: 1;
  }

  &__approve-icon {
    flex-shrink: 0;
    margin-left: 0.8rem;
  }

  &__date {
    @include body-14;

    color: $gray-500;
  }
}
</style>
