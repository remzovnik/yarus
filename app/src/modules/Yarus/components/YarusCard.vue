<script setup lang="ts">
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import YarusModel from "@/modules/Yarus/models/YarusModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

const props = defineProps<{
  model: YarusModel;
}>();

const yarusRoute = computed<RouteModel>(() => {
  return { name: "yarus-detail", params: { id: props.model.id } };
});
</script>

<template>
  <div class="yarus-card">
    <router-link :to="yarusRoute" class="yarus-card__main">
      <BaseAvatar :size="72" :image="model.image || model.icon?.image" class="yarus-card__avatar hide-mobile" />
      <BaseAvatar :size="40" :image="model.image || model.icon?.image" class="yarus-card__avatar only-mobile" />
      <span class="yarus-card__name">
        {{ props.model.name }}
      </span>
    </router-link>

    <div class="yarus-card__actions">
      <VDropdown :skidding="-20">
        <BaseButton
          class="yarus-card__button"
          icon="dots-vertical"
          type="transparent"
          size="large"
          aria-label="Действия с карточкой"
        />
        <template #popper="{ hide }">
          <ActionsMenu :target-id="model.id" :type="EActionContentType.YARUS" @click="hide" />
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="scss">
.yarus-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10.4rem;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    height: auto;
    min-height: 6.4rem;
  }

  &__main {
    @include overflow-ellipsis;

    display: flex;
    align-items: center;
    width: 100%;
    padding: 1.6rem 0;
  }

  &__actions {
    display: flex;
    flex-shrink: 1;
    margin-left: 0.8rem;
  }

  &__button {
    color: $gray-900;
  }

  &__avatar {
    flex-shrink: 0;
  }

  &__icon {
    margin-right: 8px;
  }

  &__name {
    @include overflow-ellipsis;
    @include label-16;

    margin-left: 0.8rem;

    @media (max-width: $media-sm) {
      @include clamp(2);

      white-space: normal;
    }
  }

  &__subs {
    @include body-14;

    display: flex;
    margin-top: 0.8rem;
  }

  &__more-btn {
    margin-left: 2rem;
  }

  &_short {
    background: $gray-100;
    border-radius: $border-radius-md;
  }

  &_common {
    border-bottom: 1px solid $gray-400;
  }

  &_full {
    border-bottom: 1px solid $gray-400;
  }
}
</style>
