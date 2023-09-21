<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  errorMessage: string;
  isMediumSize?: boolean;
  noLateralIndent?: boolean;
}>();

const classes = computed<object>(() => {
  return {
    [`inline-error-message_medium-size`]: !!props.isMediumSize,
    [`inline-error-message_no-lateral-indent`]: !!props.noLateralIndent,
  };
});
</script>

<template>
  <transition name="fade">
    <div v-if="!!props.errorMessage" class="inline-error-message" :class="classes">
      {{ props.errorMessage }}
    </div>
  </transition>
</template>

<style lang="scss">
.inline-error-message {
  padding: 0.4rem 1.6rem;
  color: rgb(235 87 87);
  font-size: 1rem;

  &_medium-size {
    margin: 0.4rem 0;
    padding: 0.8rem 1.6rem;
    font-size: 1.6rem;
    background-color: rgb(235 87 87 / 4%);
    border: 1px solid rgb(235 87 87);
    border-radius: 0.6rem;
  }

  &_no-lateral-indent {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
