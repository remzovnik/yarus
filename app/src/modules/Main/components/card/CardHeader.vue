<script setup lang="ts">
import { computed } from "vue";
import { isFeedGuard } from "@/domain/Feed/Feed.guard";
import { Feed } from "@/domain/Feed/Feed";
import { User } from "@/domain/User/User";
import RouteModel from "@/modules/Main/models/RouteModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { Id } from "@/_core/Base.type";
import { isUserGuard } from "@/domain/User/User.guard";

const authStore = useAuthStore();

//TODO: прокидывать всю сущность вместо полей
const props = withDefaults(
  defineProps<{
    id: Id;
    link: RouteModel;
    model: Feed | User;
    publishTime?: string;
    type: EActionContentType;
    hidden?: string[];
    isDisabled?: boolean;
  }>(),
  {
    hidden: () => [],
    isDisabled: false,
  }
);

const routeLink = computed<RouteModel>(() => {
  return isUserGuard(props.model)
    ? { name: ERouteName.USER, params: { id: props.model.id } }
    : { name: ERouteName.FEED, params: { id: props.model.id } };
});

const ownerId = computed<number>(() => {
  return isFeedGuard(props.model) ? (props.model as Feed).userId : (props.model as User).id;
});

const isUserOwner = computed<boolean>(() => {
  return !!authStore.isMyAccount(ownerId.value);
});
</script>

<template>
  <div class="card-header">
    <router-link :to="routeLink" class="card-header__author">
      <img v-lazysrc="(model as Feed).image || (model as User).photo" class="card-header__avatar" alt="" />
      <div class="card-header__text">
        <div class="card-header__title">
          <span class="card-header__title-name">{{ model?.name }} {{ (model as User).surname }}</span>

          <BaseIcon
            v-if="model.approved && type === EActionContentType.VIDEO"
            class="card-header__approve-icon"
            name="verify"
            :size="14"
          />
        </div>
        <div v-if="publishTime" class="card-header__time">{{ publishTime }}</div>
      </div>
    </router-link>

    <div class="card-header__btn">
      <VDropdown :skidding="-20">
        <BaseButton
          class="card-header__button"
          type="transparent"
          size="large"
          aria-label="Действия с карточкой"
          icon="dots-vertical"
          :is-disabled="isDisabled && !isUserOwner"
        />
        <template #popper="{ hide }">
          <ActionsMenu :target-id="id" :owner-id="ownerId" :type="type" :link="link" :hidden="hidden" @click="hide" />
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="scss">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.8rem;
  padding: 0.8rem;

  &__author {
    display: grid;
    grid-template-columns: max-content auto;
    align-items: center;
  }

  &__avatar {
    flex-shrink: 0;
    width: 3.2rem;
    height: 3.2rem;
    margin-right: 0.8rem;
    object-fit: cover;
    overflow: hidden;
    border-radius: 100%;
  }

  &__text {
    @include overflow-ellipsis;
  }

  &__title {
    @include label-14;

    display: grid;
    grid-template-columns: auto max-content;
    align-items: center;
    color: $gray-600;

    &-name {
      @include overflow-ellipsis;
    }
  }

  &__approve-icon {
    margin-left: 0.4rem;
  }

  &__time {
    @include label-12;

    color: $gray-500;
  }

  &__btn {
    margin-left: 1.6rem;
  }

  &__button {
    color: $gray-900;
  }
}
</style>
