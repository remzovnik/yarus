<script setup lang="ts">
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { kFormatter } from "@/_core/utils/Formaters";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

type ProfileLinkType = "profile" | "account" | "channel";
type ProfileLinkTheme = "dark" | "light";

const props = withDefaults(
  defineProps<{
    route?: RouteModel;
    image?: string;
    name?: string;
    surname?: string;
    subscribers?: number | string;
    nickname?: string;
    type: ProfileLinkType;
    theme?: ProfileLinkTheme;
  }>(),
  {
    theme: "light",
  }
);

const nameRoute = computed<RouteModel>(() => {
  return (
    props.route || {
      name: ERouteName.HOME,
      path: ERoutePath.HOME,
    }
  );
});

const classes = computed<StyleClasses>(() => {
  return {
    [`profile-link_type_${props.type}`]: !!props.type,
    [`profile-link_theme_${props.theme}`]: !!props.theme,
  };
});

const avatarSize = computed<number>(() => {
  return props.type === "account" ? 52 : 40;
});
</script>

<template>
  <router-link :to="nameRoute" class="profile-link" :class="classes">
    <BaseAvatar :image="image" :size="avatarSize" />
    <span class="profile-link__rightside">
      <span v-if="name" class="profile-link__name">{{ name }} {{ surname || "" }}</span>
      <span v-else class="profile-link__auth-text">Вход или регистрация</span>

      <span v-if="(type === 'profile' || type === 'account') && nickname" class="profile-link__nickname">@{{ nickname }}</span>

      <span v-if="type === 'channel' && subscribers" class="profile-link__subscribers">
        {{ kFormatter(+subscribers) }} подписчиков</span
      >
    </span>
  </router-link>
</template>

<style lang="scss">
.profile-link {
  display: flex;
  align-items: center;

  &__rightside {
    margin-left: 0.8rem;
  }

  &__auth-text {
    @include body-16;

    display: block;
    color: $gray-600;
  }

  &__name {
    @include label-14;
    @include overflow-ellipsis;

    display: block;
    color: $gray-600;
  }

  &__nickname {
    @include overflow-ellipsis;

    display: block;
    color: $gray-600;
  }

  &__subscribers {
    @include body-14;

    color: $gray-600;
  }

  &_theme {
    &_light {
      .profile-link {
        &__title {
          color: $gray-600;
        }

        &__subscribers {
          color: $gray-600;
        }
      }
    }

    &_dark {
      .profile-link {
        &__title {
          color: $white-100;
        }

        &__subscribers {
          color: $white-100;
        }
      }
    }
  }
}
</style>
