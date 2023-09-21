<script lang="ts" setup>
import { ChangeLogRecord } from "@/modules/ChangeLog/domain/ChangeLogRecord";
import { ChangeLogApiService } from "@/modules/ChangeLog/ChangeLogApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ref } from "vue";
import Seo from "@/modules/Seo/components/Seo.vue";
import AppVersion from "@/modules/ChangeLog/components/AppVersion.vue";
import BaseTag from "@/modules/Base/components/BaseTag.vue";

const recordList = ref<ChangeLogRecord[]>([]);
const init = async (): Promise<void> => {
  const response = await ServiceLocator.instance.getService(ChangeLogApiService).getChangeLogList();
  recordList.value = response.sort((a, b) => {
    return new Date(a.date) > new Date(b.date) ? -1 : 1;
  });
};

init();
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="page-change-log page">
        <h1 class="page-change-log__title page-title">История изменений</h1>
        <div v-for="record in recordList" :key="`${record.date}-${record.platform}`" class="change-log">
          <div class="change-log__header">
            <AppVersion :text="record.title" :type="record.platform" />
            <span class="change-log__date">{{ record.dateText }}</span>
          </div>
          <div v-if="record.tagList.length" class="change-log__tags">
            <BaseTag v-for="(tag, index) in record.tagList" :key="`tag-${index}`" class="change-log__tags-item" size="large">{{
              tag
            }}</BaseTag>
          </div>
          <div v-if="record.addedList.length" class="change-log__list">
            <div class="change-log__list-title">Добавили</div>
            <ul>
              <li v-for="(addedItem, index) in record.addedList" :key="`added-item-${index}`">{{ addedItem }}</li>
            </ul>
          </div>
          <div v-if="record.changedList.length" class="change-log__list">
            <div class="change-log__list-title">Изменили</div>
            <ul>
              <li v-for="(changedItem, index) in record.changedList" :key="`changed-item-${index}`">{{ changedItem }}</li>
            </ul>
          </div>
          <div v-if="record.fixList.length" class="change-log__list">
            <div class="change-log__list-title">Исправили</div>
            <ul>
              <li v-for="(fixItem, index) in record.fixList" :key="`fix-item-${index}`">{{ fixItem }}</li>
            </ul>
          </div>
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.page-change-log {
  &__title {
    margin-bottom: 2.4rem;
  }

  .change-log {
    margin-bottom: 2.4rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid $gray-300;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.2rem;
    }

    &__date {
      @include label-16;

      color: $gray-700;

      @media (max-width: $media-sm) {
        @include label-14;
      }
    }

    &__tags {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 2rem;
      column-gap: 0.4rem;
      row-gap: 0.4rem;

      &-item {
        @include label-14;
      }
    }

    &__list {
      margin-bottom: 2rem;

      &-title {
        margin-bottom: 1.2rem;
        font-weight: 600;
        font-size: 1.6rem;
        line-height: 2.6rem;
      }

      ul {
        padding-left: 2.4rem;
        list-style: inherit;
      }

      li {
        @include body-14;
      }
    }
  }
}
</style>
