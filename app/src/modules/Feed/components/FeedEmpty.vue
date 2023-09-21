<script setup lang="ts">
import { computed } from "vue";
import NoContent from "@/modules/Main/components/NoContent.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import { ERoutePath } from "@/infrastructure/Routing/RoutePath.enum";

const modal = useModal();

const props = defineProps<{ isOwner: boolean; isPaid: boolean | null }>();

const currentDescription = computed<string>(() => {
  return props.isOwner ? "Вы пока ничего не создали" : "Пользователь пока ничего не создал";
});

const createBtnClickHandler = (): void => {
  modal.showCreateContentModal({
    list: [0, 1],
  });
};
</script>

<template>
  <div class="user-feeds-empty">
    <NoContent class="user-feeds-empty__no-content" title="Здесь ничего нет 😢">{{ currentDescription }}</NoContent>

    <div v-if="isOwner" class="user-feeds-empty__no-content-controls">
      <BaseButton v-if="isPaid" size="large" type="primary" :route="ERoutePath.HOME"> Перейти на главную </BaseButton>
      <BaseButton v-else size="large" type="primary" @click="createBtnClickHandler"> + Создать </BaseButton>
    </div>
  </div>
</template>

<style lang="scss">
.user-feeds-empty {
  &__no-content {
    margin-top: 15%;
  }

  &__no-content-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2.4rem;
  }
}
</style>
