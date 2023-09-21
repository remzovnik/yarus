<script setup lang="ts">
import { useVideoStore } from "@/modules/Video/store/VideoStore";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer.vue";
import ClampedText from "@/modules/Main/components/ClampedText.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";

const videoStore = useVideoStore();

defineProps<{
  id: string;
}>();
</script>

<template>
  <LayoutBase :type="ELayoutSidebarType.NSFW">
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.NSFW" />
    </template>
    <template #content>
      <main class="video-detail-page page">
        <div v-if="videoStore.nsfwData" class="video-detail-page__leftside">
          <VideoPlayer
            class="video-detail-page__player"
            :poster="videoStore.nsfwData?.thumbnailUrl"
            :name="videoStore.nsfwData?.title"
            :embed="false"
            :m3u8="videoStore.nsfwData?.url"
            :video-id="Number(videoStore.nsfwData.id)"
          />

          <div class="video-detail-page__video-info">
            <h1 class="video-detail-page__title">{{ videoStore.nsfwData?.title }}</h1>

            <ClampedText
              v-if="videoStore.nsfwData?.description"
              class="video-detail-page__description"
              :text="videoStore.nsfwData?.description"
              :lines="4"
            />
          </div>
        </div>
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.video-detail-page {
  display: flex;

  &__leftside {
    width: 82.4rem;

    @media (max-width: $media-lg) {
      width: 65.2rem;
    }

    @media (max-width: $media-md) {
      width: 100%;
    }
  }

  &__player {
    margin-bottom: 2.4rem;
  }

  &__title {
    @include headline-32;

    margin-bottom: 1.8rem;
    word-break: break-word;

    @media (max-width: $media-sm) {
      @include headline-24;
    }
  }

  &__description {
    @include body-16;

    margin-bottom: 2.5rem;
  }
}
</style>
