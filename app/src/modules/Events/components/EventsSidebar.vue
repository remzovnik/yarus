<script setup lang="ts">
import ButtonTechnical from "@/modules/Main/components/buttons/ButtonTechnical.vue";
import ButtonShare from "@/modules/Main/components/buttons/ButtonShare.vue";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import EventModel from "@/modules/Events/models/EventModel";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

const emit = defineEmits(["rating-click"]);

defineProps<{
  model: EventModel;
}>();

const ratingClickHandler = (): void => {
  emit("rating-click");
};
</script>

<template>
  <div class="sidebar-events">
    <ButtonTechnical
      size="large"
      class="sidebar-events__button hide-desktop-m"
      :icon="model.estimate ? 'star-fill' : 'star'"
      :caption="model.rating"
      aria-label="Оценить"
      @click="ratingClickHandler"
    />
    <ButtonTechnical
      size="small"
      class="sidebar-events__button hide-desktop"
      :icon="model.estimate ? 'star-fill' : 'star'"
      :caption="model.rating"
      aria-label="Оценить"
      @click="ratingClickHandler"
    />

    <ButtonShare class="sidebar-events__button" :content-type="EActionContentType.EVENT">
      <ButtonTechnical class="hide-desktop-m" size="large" icon="share" aria-label="Поделиться" />
      <ButtonTechnical class="hide-desktop" size="small" icon="share" aria-label="Поделиться" />
    </ButtonShare>
    <VDropdown placement="right-start" :skidding="60">
      <ButtonTechnical icon="dots-vertical" class="sidebar-events__button hide-desktop-m" size="large" aria-label="Действия" />
      <ButtonTechnical icon="dots-vertical" class="sidebar-events__button hide-desktop" size="small" aria-label="Действия" />

      <template #popper="{ hide }">
        <ActionsMenu
          :target-id="model.id"
          :owner-id="model.author.id"
          :type="EActionContentType.EVENT"
          :hidden="['share']"
          @click="hide()"
        />
      </template>
    </VDropdown>
  </div>
</template>

<style lang="scss">
.sidebar-events {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  @media (max-width: $media-md) {
    align-items: center;
  }

  &__button {
    margin-top: 1.6rem;
  }
}
</style>
