<script setup lang="ts">
import MusicPageLayout from "@/modules/Music/layouts/MusicPageLayout.vue";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { ref } from "vue";
import TrackList from "@/modules/Music/components/Track/TrackList.vue";
import MusicPageHeader from "@/modules/Music/components/MusicPageHeader.vue";
import useTracks from "@/modules/Music/composables/useTracks";
import { EMusicContentGrid } from "@/modules/Music/infrastructure/MusicContentGrid.enum";
import MusicContentSection from "@/modules/Music/components/MusicContentSection.vue";
import { EMusicPageHeaderType } from "@/modules/Music/infrastructure/MusicPageHeaderType.enum";
import useCategories from "@/modules/Music/composables/useCategories";
import CategoryItem from "@/modules/Music/components/CategoryItem.vue";
const audioPlayerStore = useAudioStore();
const isLoading = ref<boolean>(true);
const { categoryList, loadCategoriesChunk, categoryListIsLoaded } = useCategories(20);

const init = async (): Promise<void> => {
  await loadCategoriesChunk();
  isLoading.value = false;
};

init();
</script>
<template>
  <MusicPageLayout :is-loading="isLoading">
    <template #leftside>
      <Transition name="fade">
        <div v-if="!isLoading">
          <MusicPageHeader :type="EMusicPageHeaderType.CATEGORY" :is-play-button-shown="false" />
          <MusicContentSection :has-header="false" :content-grid-type="EMusicContentGrid.ARTIST">
            <CategoryItem v-for="categoryItem in categoryList" :key="categoryItem.id" :model="categoryItem" />
            <BaseInfiniteScroll v-if="!categoryListIsLoaded" @on-intersect="loadCategoriesChunk" />
          </MusicContentSection>
        </div>
      </Transition>
      <BaseSpinner v-if="isLoading" />
    </template>
  </MusicPageLayout>
</template>
<style lang="scss" scoped>
.music-category-item {
  width: 15.2rem;
  height: 15.2rem;
}
</style>
