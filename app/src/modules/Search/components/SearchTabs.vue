<script lang="ts" setup>
import RouteModel from "@/modules/Main/models/RouteModel";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const route = useRoute();
const router = useRouter();
const props = defineProps<{ isDisabled?: boolean }>();

const pages = computed<RouteModel[]>(() => {
  return [
    {
      linkName: "Пользователи",
      name: `search-${ESearchContentType.USER}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Хештеги",
      name: `search-${ESearchContentType.HASHTAG}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Ленты",
      name: `search-${ESearchContentType.FEED}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Посты",
      name: `search-${ESearchContentType.POST}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Новости",
      name: `search-${ESearchContentType.NEWS}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Видео",
      name: `search-${ESearchContentType.VIDEO}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Музыка",
      name: `search-${ESearchContentType.MUSIC}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "Сюжеты",
      name: `search-${ESearchContentType.CLIP}`,
      query: {
        text: route.query.text,
      },
    },
    {
      linkName: "События",
      name: `search-${ESearchContentType.EVENT}`,
      query: {
        text: route.query.text,
      },
    },
  ];
});

const isActive = (link: RouteModel): boolean => {
  if (
    [ERouteName.SEARCH_PLAYLIST, ERouteName.SEARCH_ALBUM, ERouteName.SEARCH_TRACK, ERouteName.SEARCH_ARTIST].includes(
      route.name as ERouteName
    ) &&
    link.name === ERouteName.SEARCH_MUSIC
  ) {
    return true;
  }
  return route.name === link.name;
};

const clickHandler = (page: RouteModel): void => {
  if (!props.isDisabled) {
    router.push({ name: page.name, query: page.query });
  }
  let metrikaKey;
  switch (page.name) {
    case `search-${ESearchContentType.USER}`:
      metrikaKey = "users";
      break;
    case `search-${ESearchContentType.HASHTAG}`:
      metrikaKey = "hashtag";
      break;
    case `search-${ESearchContentType.NEWS}`:
      metrikaKey = "news";
      break;
    case `search-${ESearchContentType.FEED}`:
      metrikaKey = "feed";
      break;
    case `search-${ESearchContentType.POST}`:
      metrikaKey = "posts";
      break;
    case `search-${ESearchContentType.VIDEO}`:
      metrikaKey = "video";
      break;
    case `search-${ESearchContentType.CLIP}`:
      metrikaKey = "clips";
      break;
    case `search-${ESearchContentType.EVENT}`:
      metrikaKey = "events";
      break;
    default:
      break;
  }

  try {
    /* global ym */
    //@ts-ignore
    ym(74194660, "reachGoal", `serp_${metrikaKey}`);
    // eslint-disable-next-line no-empty
  } catch {}
  // todo требует починки, см. main.ts
  // $metrika.reachGoal(`serp_${metrikaKey}`);
};
</script>

<template>
  <div class="search-tabs">
    <div class="search-tabs__wrapper">
      <div
        v-for="(page, index) in pages"
        :key="index"
        class="search-tabs__item"
        :class="{
          'search-tabs__item_active': isActive(page),
          'search-tabs__item_disabled': props.isDisabled,
        }"
        @click="clickHandler(page)"
      >
        {{ page.linkName }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.search-tabs {
  border-bottom: 1px solid $gray-300;

  &__wrapper {
    @include hide-scroll;

    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }

  &__item {
    @include label-16;

    position: relative;
    margin-right: 2.4rem;
    padding: 1.4rem 0;
    cursor: pointer;
    transition: color $trs-back;
    user-select: none;

    &::after {
      position: absolute;
      bottom: -0.1rem;
      left: 0;
      width: 100%;
      height: 0.2rem;
      border-radius: $border-radius-md;
      transform: scaleX(0);
      transition: transform $trs-back;
      content: "";

      @media (max-width: $media-sm) {
        height: 0.3rem;
      }
    }

    &_active {
      color: $blue-100;

      &::after {
        background-color: $blue-100;
        transform: scaleX(1);
      }
    }

    &:hover:not(.search-tabs__item_disabled, .search-tabs__item_active) {
      &::after {
        background: $gray-400;
        transform: scaleX(1);

        @media (max-width: $media-sm) {
          transform: scaleX(0);
        }
      }
    }
  }
}
</style>
