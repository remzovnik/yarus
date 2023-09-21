<script setup lang="ts">
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { kFormatter } from "@/_core/utils/Formaters";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { Feed } from "@/domain/Feed/Feed";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import { EFeedCardType } from "@/modules/Feed/FeedCard.const/EFeedCardType.enum";
import { EFeedCardAction } from "@/modules/Feed/FeedCard.const/EFeedCardAction.enum";

const authStore = useAuthStore();

const emit = defineEmits<{
  (e: "pick"): void;
}>();

const props = defineProps<{
  model: Feed;
  type: EFeedCardType;
  actions: EFeedCardAction[];
}>();

const feedRoute = computed<RouteModel>(() => {
  return { name: ERouteName.FEED, params: { id: props.model.slug || props.model.id } };
});

const classes = computed<StyleClasses>(() => {
  return {
    "feed-card_short": props.type === EFeedCardType.SHORT,
    "feed-card_common": props.type === EFeedCardType.COMMON,
    "feed-card_full": props.type === EFeedCardType.FULL,
    "feed-card_default": props.type === EFeedCardType.DEFAULT,
  };
});
</script>

<template>
  <div class="feed-card" :class="classes">
    <router-link :to="feedRoute" class="feed-card__main">
      <div class="feed-card__avatar-container">
        <BaseAvatar :size="72" :image="model.image" class="feed-card__avatar" />

        <div v-if="model.isPrivate" class="feed-card__lock-container">
          <BaseIcon class="feed-card__lock" name="lock" :size="36" />
        </div>

        <img v-if="model.isPaid" class="feed-card__coin" src="/images/gift-coin.svg" alt="" />
      </div>

      <span class="feed-card__info">
        <span class="feed-card__name">
          {{ model.name }}
        </span>
        <span class="feed-card__subs">
          <BaseIcon name="followers" class="feed-card__icon" />
          {{ kFormatter(model.countSubscriber) }}
        </span>
      </span>
    </router-link>

    <div class="feed-card__actions">
      <ButtonSubscribe
        v-if="actions.includes(EFeedCardAction.SUBSCRIBE) && !authStore.isMyAccount(model.userId) && !model.isPrivate"
        :id="model.id"
        :is-subscribed="model.isSubscribe"
        :is-tablet-immutable="true"
        :type="ESubscribeType.FEED"
        size="large"
      />

      <div v-if="actions.includes(EFeedCardAction.MORE)" class="feed-card__more-btn">
        <VDropdown :skidding="-20">
          <BaseButton
            class="feed-card__more-button"
            type="transparent"
            size="large"
            aria-label="Действия с карточкой"
            icon="dots-vertical"
          />
          <template #popper="{ hide }">
            <ActionsMenu
              :target-id="model.id"
              :owner-id="model.userId"
              :type="EActionContentType.FEED"
              :link="feedRoute"
              @click="hide"
            />
          </template>
        </VDropdown>
      </div>

      <template v-if="actions.includes(EFeedCardAction.PICK)">
        <BaseButton class="hide-mobile" subtype="text" size="large" icon="mix" @click="emit('pick')"
          >Выбрать другую ленту</BaseButton
        >
        <BaseButton class="only-mobile" subtype="text" icon="mix" @click="emit('pick')" />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.feed-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10.4rem;

  @media (max-width: $media-sm) {
    height: auto;
    min-height: 7rem;
  }

  &__main {
    @include overflow-ellipsis;

    display: flex;
    align-items: center;
    padding: 1.6rem 0;
  }

  &__actions {
    display: flex;
    flex-shrink: 1;
    align-items: center;
    margin-left: 0.8rem;
  }

  &__avatar-container {
    position: relative;
    flex-shrink: 0;
  }

  &__avatar {
    @media (max-width: $media-sm) {
      width: 4rem !important;
      height: 4rem !important;
    }
  }

  &__lock-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $white-100;
    background-color: $black-100-40;
    border-radius: 50%;
  }

  &__icon {
    margin-right: 8px;
  }

  &__info {
    @include overflow-ellipsis;

    margin-left: 0.8rem;
  }

  &__name {
    @include overflow-ellipsis;
    @include label-16;
    @include clamp(2);

    white-space: normal;
    word-break: break-word;
  }

  &__coin {
    position: absolute;
    top: 0;
    right: 0;
  }

  &__subs {
    @include body-14;

    display: flex;
    margin-top: 8px;
  }

  &__more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 2rem;
  }

  &__more-button {
    color: $gray-900;
  }

  &_short,
  &_default {
    padding-right: 1.6rem;
    padding-left: 1.6rem;
    background: $gray-100;
    border-radius: $border-radius-md;

    @media (max-width: $media-sm) {
      padding-right: 1.2rem;
      padding-left: 1.2rem;
    }
  }

  &_short {
    border-bottom: 1px solid $gray-300;
  }

  &_common,
  &_full {
    border-bottom: 1px solid $gray-400;
  }
}
</style>
