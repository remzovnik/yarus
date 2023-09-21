<script lang="ts" setup>
import { Hashtag } from "@/domain/Hashtag/Hashtag";
import { computed } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import ButtonSubscribe from "@/modules/Main/components/buttons/ButtonSubscribe.vue";
import { ESubscribeType } from "@/modules/Subscribe/types/ESubscribeType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const props = defineProps<{ model: Hashtag }>();

const hashtagRoute = computed<RouteModel>(() => {
  return {
    name: ERouteName.HASHTAG,
    params: {
      id: props.model.name,
    },
  };
});
</script>

<template>
  <div class="card-search-hashtag">
    <router-link class="card-search-hashtag__main" :to="hashtagRoute">
      <div class="card-search-hashtag__name">#{{ model.name }}</div>
    </router-link>

    <div class="card-search-hashtag__actions">
      <ButtonSubscribe
        :id="props.model.name"
        :is-subscribed="props.model.isSubscribe"
        :type="ESubscribeType.HASHTAG"
        size="large"
        is-tablet-immutable
      />
    </div>
  </div>
</template>

<style lang="scss">
.card-search-hashtag {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 8rem;
  border-bottom: 1px solid $gray-300;

  @media (max-width: $media-sm) {
    height: 6.4rem;
  }

  &__main {
    @include overflow-ellipsis;

    display: flex;
    align-items: center;
    width: 100%;
  }

  &__actions {
    display: flex;
    flex-shrink: 1;
    margin-left: 0.8rem;
  }

  &__name {
    @include overflow-ellipsis;
    @include label-16;

    color: $gray-600;
    background-color: $white-100;
  }
}
</style>
