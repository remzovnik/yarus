<script lang="ts" setup>
import Seo from "@/modules/Seo/components/Seo.vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import { INFO_PAGE_DESCRIPTION, INFO_PAGE_LIST, INFO_PAGE_TITLE } from "@/modules/Info/data/info.const";

const seoModel = new SeoModel({
  meta_title: INFO_PAGE_TITLE,
  meta_description: INFO_PAGE_DESCRIPTION,
});
</script>

<template>
  <Seo :model="seoModel" />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <main class="page-info page" itemscope itemtype="http://schema.org/WebPage">
        <h1 class="page-info__title page-title" itemprop="name">Информация</h1>
        <ul class="page-info__links" itemscope itemtype="http://schema.org/ItemList">
          <li
            v-for="(documentInfo, index) in INFO_PAGE_LIST"
            :key="documentInfo.id"
            class="page-info__item"
            itemprop="itemListElement"
            itemscope
            itemtype="http://schema.org/DigitalDocument"
          >
            <meta itemprop="name" :content="documentInfo.title" />
            <meta itemprop="usageInfo" :content="documentInfo.href" />
            <meta itemprop="position" :content="`${index + 1}`" />
            <BaseIcon class="page-info__icon" :name="documentInfo.iconName" :size="24" />

            <router-link v-if="documentInfo.route" class="page-info__link" :to="documentInfo.route">{{
              documentInfo.title
            }}</router-link>
            <a v-else target="_blank" :href="documentInfo.href" :title="documentInfo.title" class="page-info__link">{{
              documentInfo.title
            }}</a>
          </li>
        </ul>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.page-info {
  &__title {
    margin-bottom: 5.2rem;
  }

  &__links {
    color: $gray-600;
  }

  &__item {
    @include headline-18;

    display: flex;
    margin-top: 1.6rem;
    padding-bottom: 1.8rem;
    border-bottom: 1px solid $gray-400;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__link {
    margin-left: 2rem;
    color: inherit;
    text-decoration: none;
  }
}
</style>
