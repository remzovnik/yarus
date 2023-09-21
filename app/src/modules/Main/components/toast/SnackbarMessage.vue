<script setup lang="ts">
import { computed, onMounted } from "vue";
import BaseIcon from "@/modules/Base/components/BaseIcon.vue";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(defineProps<{ id?: number; withStatus?: boolean; statusType?: StatusType; text?: string }>(), {
  withStatus: false,
  statusType: "false",
});

const emit = defineEmits<{ (e: "close", id: number | undefined): void }>();

const closeInterval = 8000;
type StatusType = "false" | "true";

const classes = computed<StyleClasses>(() => {
  return {
    snackbar_done: props.statusType === "true",
  };
});

onMounted(() => {
  setTimeout(async () => {
    emit("close", props.id);
  }, closeInterval);
});
</script>

<template>
  <div class="snackbar" :class="classes" @click="emit('close', props.id)">
    <div v-if="withStatus" class="snackbar__icon">
      <BaseIcon :size="24" :name="statusType === 'true' ? 'done' : 'error-info'" />
    </div>
    <div class="snackbar__text">{{ props.text }}</div>
  </div>
</template>

<style lang="scss">
.snackbar {
  @include body-16;

  display: flex;
  align-items: flex-start;
  margin-top: 0.8rem;
  padding: 1.6rem;
  color: $gray-600;
  background: $white-100;
  border-radius: 1.2rem;
  box-shadow: $box-shadow-deep;

  &__icon {
    flex-shrink: 0;
    margin-right: 1.2rem;
  }

  &__text {
    white-space: pre-wrap;
    word-break: break-word;
  }

  &_done {
    .snackbar__icon {
      svg {
        fill: $green-100;
      }
    }
  }
}
</style>
