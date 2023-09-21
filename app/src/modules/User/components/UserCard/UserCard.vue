<script lang="ts" setup>
import { computed } from "vue";
import { EUserCardType } from "@/modules/User/components/UserCard/EUserCardType.eum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import RouteModel from "@/modules/Main/models/RouteModel";
import { User } from "@/domain/User/User";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(defineProps<{ model: User; type?: EUserCardType; isLinkDisabled?: boolean }>(), {
  type: EUserCardType.DEFAULT,
  isLinkDisabled: false,
});

const link = computed<RouteModel>(() => {
  return { name: ERouteName.USER, params: { id: props.model.id } };
});

const classes = computed<StyleClasses>(() => {
  return {
    [`user-card_type_${props.type}`]: !!props.type,
    "user-card_link-disabled": props.isLinkDisabled,
  };
});
</script>

<template>
  <div class="user-card" :class="classes">
    <router-link class="user-card__main" :to="link">
      <BaseAvatar class="user-card__avatar" :image="model.photo" :size="props.type === EUserCardType.DEFAULT ? 72 : 48" />
      <span class="user-card__rightside">
        <span class="user-card__title">
          <span class="user-card__title-text">{{ model.name }} {{ model.surname }}</span>

          <BaseIcon v-if="model.approved" class="user-card__approve-icon" name="verify" :size="16" />
        </span>
        <span v-if="model.nickname" class="user-card__nickname"> @{{ model.nickname }} </span>
      </span>
    </router-link>

    <div class="user-card__actions">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.user-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $gray-300;

  &__main {
    @include overflow-ellipsis;

    display: grid;
    grid-template-columns: max-content auto;
    align-items: center;
    width: 100%;
    background-color: $white-100;
  }

  &__actions {
    display: flex;
    flex-shrink: 1;
    margin-left: 0.8rem;
  }

  &__rightside {
    @include overflow-ellipsis;

    margin-left: 0.8rem;
  }

  &__title {
    display: flex;
    align-items: center;
    color: $gray-600;
  }

  &__title-text {
    @include overflow-ellipsis;
  }

  &__approve-icon {
    flex-shrink: 0;
    margin-left: 0.8rem;
  }

  &__nickname {
    @include overflow-ellipsis;
    @include body-14;

    display: block;
  }

  &__avatar {
    flex-shrink: 0;

    @media (max-width: $media-sm) {
      width: 4rem !important;
      height: 4rem !important;
    }
  }

  &_type {
    &_default {
      height: 10.4rem;

      @media (max-width: $media-sm) {
        height: 7rem;
      }

      .user-card {
        &__title {
          @include label-16;
        }

        &__nickname {
          color: $gray-600;
        }
      }
    }

    &_follower {
      height: 6.6rem;

      .user-card {
        &__title {
          @include body-16;
        }

        &__nickname {
          color: $gray-650;
        }
      }
    }
  }

  &_link-disabled {
    .user-card__main {
      pointer-events: none;
    }
  }
}
</style>
