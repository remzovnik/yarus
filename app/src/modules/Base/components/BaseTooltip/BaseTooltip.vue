<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ETooltipPosition } from "@/modules/Base/components/BaseTooltip/ETooltipPosition.enum";
import useYarusBreakpoints from "@/modules/Main/composables/useYarusBreakpoints";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const props = withDefaults(defineProps<{ isVisible?: boolean; position?: ETooltipPosition; offset?: number }>(), {
  isVisible: true,
  position: ETooltipPosition.CENTER,
  offset: 8,
});
const { isMobile } = useYarusBreakpoints();
const wrapper = ref<HTMLDivElement>();
const tooltip = ref<HTMLDivElement>();
const tooltipIsShown = ref<boolean>(false);

const classes = computed<StyleClasses>(() => {
  return {
    "base-tooltip__content_shown": tooltipIsShown.value,
  };
});

const toggleTooltipVisibility = (value: boolean): void => {
  if (props.isVisible) {
    tooltipIsShown.value = value;
  } else {
    tooltipIsShown.value = false;
  }
};

watch(
  () => tooltipIsShown.value,
  () => {
    if (wrapper.value && tooltip.value) {
      const tooltipWidth = tooltip.value.offsetWidth;
      const tooltipHeight = tooltip.value.offsetHeight;
      const centerWrapperY = `calc(50% - ${tooltipHeight / 2}px)`;
      const centerWrapperX = `calc(50% - ${tooltipWidth / 2}px)`;

      //TODO: прихвачено из лендинга музыки, под вебку нужно будет довести до ума при необходимости
      // const parentContainer: HTMLElement | null = wrapper.value.closest("div");
      // const lengthBetweenWrapperAndParent =
      //   wrapper.value.getBoundingClientRect().left - (parentContainer?.getBoundingClientRect().left || 0);
      // const canShowTooltipLeft =
      //   lengthBetweenWrapperAndParent + tooltipWidth > (parentContainer?.offsetWidth || 0) &&
      //   lengthBetweenWrapperAndParent > tooltipWidth;

      // let direction: ETooltipPosition = ;

      // if (props.position === ETooltipPosition.AUTO) {
      //   if (isMobile.value) {
      //     direction = ETooltipPosition.CENTER;
      //   } else {
      //     direction = canShowTooltipLeft ? ETooltipPosition.LEFT : ETooltipPosition.RIGHT;
      //   }
      // } else {
      //   direction = props.position;
      // }
      switch (props.position) {
        case ETooltipPosition.CENTER:
          tooltip.value.style.top = centerWrapperY;
          tooltip.value.style.left = centerWrapperX;
          break;
        case ETooltipPosition.BOTTOM:
          tooltip.value.style.top = `calc( 100% + ${props.offset}px)`;
          tooltip.value.style.left = centerWrapperX;
          break;
        case ETooltipPosition.RIGHT:
          tooltip.value.style.top = centerWrapperY;
          tooltip.value.style.left = "100%";
          break;
        case ETooltipPosition.TOP:
          tooltip.value.style.top = `-${tooltipHeight}px`;
          tooltip.value.style.left = centerWrapperX;
          break;
        case ETooltipPosition.LEFT:
          tooltip.value.style.top = centerWrapperY;
          tooltip.value.style.left = `-${tooltipWidth}px`;
          break;
        case ETooltipPosition.BOTTOM_END:
          tooltip.value.style.top = `calc( 100% + ${props.offset}px)`;
          tooltip.value.style.right = "0";
          tooltip.value.style.left = "auto";
          break;
        default:
          //Пока флоу нет просто повоторяем паттерн ETooltipPosition.BOTTOM
          tooltip.value.style.top = `calc( 100% + ${props.offset}px)`;
          tooltip.value.style.left = centerWrapperX;
          break;
      }
    }
  }
);
watch(
  () => props.isVisible,
  (newVal) => {
    if (!newVal) {
      tooltipIsShown.value = false;
    }
  }
);
</script>
<template>
  <div ref="wrapper" class="base-tooltip">
    <div class="base-tooltip__trigger" @mouseenter="toggleTooltipVisibility(true)" @mouseleave="toggleTooltipVisibility(false)">
      <slot name="trigger"> </slot>
    </div>
    <div ref="tooltip" class="base-tooltip__content" :class="classes">
      <slot name="content"> </slot>
    </div>
  </div>
</template>

<style lang="scss">
.base-tooltip {
  position: relative;
  cursor: pointer;

  &__content {
    @include label-12;

    position: absolute;
    z-index: 2;
    width: max-content;
    max-width: 28.8rem;
    padding: 0.6rem 1.2rem;
    color: $white-100;
    background: $gray-800-60;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
    opacity: 0;
    transition: opacity $trs-back;
    pointer-events: none;

    &_shown {
      opacity: 1;
      transition: opacity $trs-forward;
    }
  }
}
</style>
