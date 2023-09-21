<script lang="ts" setup>
import Error from "@/modules/Main/components/Error.vue";
import useModal from "@/modules/Main/components/modal/useModal";

const modal = useModal();

const feedbackClickHandler = (): void => {
  modal.showFeedbackModal();
};
</script>

<template>
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar />
    </template>
    <template #content>
      <Error
        class="error-blocked-page"
        title="Нет доступа 😢"
        description="Профиль заблокирован модерацией"
        image="/images/blocked.png"
        :is-home-button="false"
        button-text="Написать в техподдержку"
        @click="feedbackClickHandler"
      />
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.error-blocked-page {
  img {
    width: 17rem;
    height: 14rem;

    @media (max-width: $media-sm) {
      width: 10.8rem;
      height: 8.9rem;
    }
  }
}
</style>
