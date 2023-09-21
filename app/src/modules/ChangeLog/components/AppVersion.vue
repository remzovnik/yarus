<script lang="ts" setup>
import BaseIcon from "@/modules/Base/components/BaseIcon.vue";
import { computed } from "vue";
import { EPlatform } from "@/modules/ChangeLog/domain/Platform.enum";

const props = defineProps<{
  type: EPlatform;
  text: string;
}>();

const iconName = computed<string>(() => {
  return props.type === EPlatform.ANDROID ? "android" : "apple";
});
</script>

<template>
  <div class="app-version">
    <BaseIcon class="app-version__icon" :size="20" :name="iconName" />
    <span class="app-version__text">{{ props.text }}</span>
  </div>
</template>

<style lang="scss">
.app-version {
  @include headline-18;

  display: flex;
  align-items: center;

  &__icon {
    margin-right: 0.8rem;
  }

  &__text {
    font-weight: 700;
    font-size: 2.4rem;
    line-height: 2.8rem;

    @media (max-width: $media-lg) {
      font-size: 1.8rem;
      line-height: 2.4rem;
    }
  }
}
</style>
