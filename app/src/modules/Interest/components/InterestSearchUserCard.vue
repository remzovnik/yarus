<script setup lang="ts">
import { InterestUserCard } from "@/domain/Interest/InterestUserCard";
import BaseAvatar from "@/modules/Base/components/BaseAvatar.vue";

const props = defineProps<{ model: InterestUserCard }>();
</script>

<template>
  <div class="interest-search-user-card">
    <div class="interest-search-user-card__info">
      <BaseAvatar :image="model.user.photo" class="interest-search-user-card__avatar" :size="160" />

      <div class="interest-search-user-card__title">
        <span class="interest-search-user-card__title-text"> {{ model.fullName }} </span>
        <BaseIcon v-if="model.user.approved" class="interest-search-user-card__approve-icon" name="verify" :size="20" />
      </div>

      <div class="interest-search-user-card__interests">
        <div>Общие интересы:</div>
        <div class="interest-search-user-card__interests-list">
          {{ model.cardInterests }}
        </div>
      </div>
    </div>
    <BaseButton is-full-width class="interest-search-user-card__link" :route="model.userRoute" is-accent type="transparent"
      >Перейти в профиль</BaseButton
    >
  </div>
</template>

<style lang="scss">
.interest-search-user-card {
  background-color: $gray-100;
  border-radius: $border-radius-md;

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1.6rem 2.4rem;
  }

  &__title {
    @include headline-18;

    display: inline-flex;
    align-items: center;
    max-width: 100%;
    margin-top: 2.4rem;
    color: $gray-900;
  }

  &__title-text {
    @include overflow-ellipsis;
  }

  &__approve-icon {
    margin-left: 0.8rem;
  }

  &__interests {
    @include body-14;

    width: 100%;
    max-width: 100%;
    height: 6rem;
    margin-top: 0.8rem;
    color: $gray-600;
    text-align: center;
  }

  &__interests-list {
    @include clamp(2);
  }

  &__link {
    padding: 1.8rem;
    border-top: 1px solid $gray-300;
  }
}
</style>
