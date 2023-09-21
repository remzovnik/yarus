<script setup lang="ts">
import { computed } from "vue";
import { Clip } from "@/domain/Clip/Clip";
import { kFormatter } from "@/_core/utils/Formaters";
import { useClipStore } from "../stores/ClipStore";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ClipOriginModel } from "../models/ClipOriginModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import useBoringContent from "@/modules/BoringContent/composable/useBoringContent";
import MarkAsBoring from "@/modules/BoringContent/components/MarkAsBoring.vue";

const clipStore = useClipStore();

const props = defineProps<{
  model: Clip;
  origin: ClipOriginModel;
}>();

const { isContentBoring } = useBoringContent(props.model.id, EActionContentType.CLIP);

const clipRouteLink = computed<RouteModel>(() => {
  return {
    name: ERouteName.CLIP_DETAIL,
    params: { id: props.model.id },
  };
});

const isProcessing = computed<boolean>(() => {
  return [0, 2].includes(props.model.status);
});

const setClipOrigin = (): void => {
  clipStore.setOrigin(props.origin);
};
</script>

<template>
  <MarkAsBoring v-if="isContentBoring" />
  <div v-else class="clip-card">
    <div v-if="isProcessing" class="clip-card__link clip-card__link_processing">
      <img v-lazysrc="model.image" class="clip-card__image" alt="" />
      <BaseReaction class="clip-card__reaction" theme="light" type="views">{{
        kFormatter(props.model.metricsFull?.views)
      }}</BaseReaction>

      <div class="clip-card__overlay">
        <BaseIcon class="clip-card__overlay-icon" :size="24" name="timer" />
        <span class="clip-card__overlay-text">Идёт обработка</span>
      </div>
    </div>

    <router-link v-else class="clip-card__link" :to="clipRouteLink" @click="setClipOrigin">
      <img v-lazysrc="model.image" class="clip-card__image" alt="" />
      <BaseReaction class="clip-card__reaction" theme="light" type="views">{{
        kFormatter(props.model.metricsFull?.views)
      }}</BaseReaction>
    </router-link>

    <div class="clip-card__actions">
      <VDropdown :skidding="-20">
        <BaseButton type="transparent" size="large" title="Действия с клипом" icon="dots-vertical" />
        <template #popper="{ hide }">
          <ActionsMenu
            :target-id="model.id"
            :owner-id="model.user.id"
            :type="EActionContentType.CLIP"
            :link="clipRouteLink"
            :hidden="isProcessing ? ['share', 'edit'] : []"
            @click="hide()"
          />
        </template>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="scss">
.clip-card {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: $border-radius-md;

  &_boring {
    background: $gray-200;
  }

  &__link {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-flex;
    width: 100%;
    height: 100%;

    &_processing {
      .clip-card__overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: $white-100;
        background: $gray-800-60;

        &-icon {
          margin-bottom: 1rem;
        }

        &-text {
          @include body-14;
        }
      }
    }
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    background: $gray-600-gradient;
    content: "";
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $border-radius-md;
  }

  &__reaction {
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  &__actions {
    position: absolute;
    top: 1.2rem;
    right: 0.4rem;
    z-index: 2;

    .svg-icon {
      color: $white-100;
    }
  }
}
</style>
