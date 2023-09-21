<script lang="ts" setup>
import SearchLayout from "@/modules/Search/layouts/SearchLayout.vue";
import useSearch from "@/modules/Search/composables/useSearch";
import UserCard from "@/modules/User/components/UserCard/UserCard.vue";
import NewsHotSkeleton from "@/modules/News/components/NewsHotSkeleton.vue";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";

const { users, isLoading, isNotFoundShown, hasMore, loadChunkData } = useSearch(ESearchContentType.USER);
</script>

<template>
  <SearchLayout :is-disabled="isLoading" :is-not-found-shown="isNotFoundShown">
    <template #page>
      <template v-if="!!users.length">
        <UserCard v-for="card in users" :key="card.id" :model="card">
          <ButtonSubscribe
            :id="+card.id"
            :is-subscribed="card.isSubscribe"
            :type="ESubscribeType.USER"
            size="large"
            :is-tablet-immutable="true"
          />
        </UserCard>
      </template>

      <NewsHotSkeleton v-if="isLoading" />

      <BaseInfiniteScroll v-if="hasMore && !isLoading" @on-intersect="loadChunkData" />
    </template>
  </SearchLayout>
</template>
