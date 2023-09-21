<script setup lang="ts">
import { computed, onMounted, ref, Ref } from "vue";
import PostModel from "../models/PostModel";
import { kFormatter } from "@/_core/utils/Formaters";
import useModal from "@/modules/Main/components/modal/useModal";
import RouteModel from "@/modules/Main/models/RouteModel";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useBreakpoints } from "@vueuse/core";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import useYarusBreakpoints from "@/modules/Main/composables/useYarusBreakpoints";
import { Feed } from "@/domain/Feed/Feed";
import { isFeedGuard } from "@/domain/Feed/Feed.guard";
import { ServiceLocator } from "@/_core/service/ServiceLocator";

const modal = useModal();
const authStore = useAuthStore();

const props = withDefaults(defineProps<{ model: PostModel | Feed; isPreview?: boolean }>(), {
  isPreview: false,
});

const { isMobile } = useYarusBreakpoints();
const feedModel = ref<Feed>(ServiceLocator.factory.feed.createDefault());

const feedRoute = computed<RouteModel>(() => {
  return { name: ERouteName.FEED, params: { id: feedModel.value?.id } };
});

onMounted(() => {
  feedModel.value = isFeedGuard(props.model) ? props.model : props.model.feed;
});
</script>

<template>
  <div class="post-header">
    <component :is="isPreview ? 'span' : 'router-link'" class="post-header__link" :to="feedRoute">
      <BaseAvatar :image="feedModel.image" :size="48" is-outlined />
      <span class="post-header__info">
        <div class="post-header__title">
          {{ feedModel.name }}
        </div>
        <span class="post-header__subscribers">
          <BaseIcon class="post-header__icon" name="followers" />
          {{ kFormatter(feedModel.countSubscriber) }}
        </span>
      </span>
    </component>

    <ButtonSubscribe
      v-if="!isPreview && !authStore.isMyAccount(feedModel.userId)"
      :id="feedModel.id"
      class="post-header__subscribe"
      :is-subscribed="feedModel.isSubscribe"
      :type="ESubscribeType.FEED"
      size="large"
      :is-always-secondary="!isMobile"
      :is-tablet-immutable="true"
    />
  </div>
</template>

<style lang="scss">
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    border-bottom: none;
  }

  &__link {
    display: grid;
    grid-template-columns: max-content auto;
    align-items: center;
    padding: 1.6rem 0;

    @media (max-width: $media-sm) {
      padding: 0.8rem 0;
      border-bottom: 0;
    }
  }

  &__info {
    @include overflow-ellipsis;

    margin-left: 0.8rem;
  }

  &__title {
    @include overflow-ellipsis;
    @include label-16;

    color: $gray-600;
  }

  &__subscribers {
    @include body-14;

    display: flex;
    align-items: center;
    margin-top: 0.8rem;
    color: $gray-600;
  }

  &__icon {
    margin-right: 0.4rem;
  }

  &__subscribe {
    margin-left: 1.6rem;
  }
}
</style>
