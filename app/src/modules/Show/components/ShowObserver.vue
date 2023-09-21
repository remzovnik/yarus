<script setup lang="ts">
import { SHOW_OBSERVER_OPTIONS } from "@/modules/Show/const/ShowObserverOptions.const";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";
import { computed, VNodeRef } from "vue";
import { EContentType } from "@/domain/Content/EContentType.enum";
import { Id } from "@/_core/Base.type";
import { ServiceLocator } from "@/_core/service/ServiceLocator";

const props = defineProps<{
  class?: string | StyleClasses;
  id: Id;
  type: EContentType;
}>();

const showService = ServiceLocator.service.show;

const refName = (el): VNodeRef | undefined => {
  if (el) {
    showObserver.value.observe(el);
  } else {
    showObserver.value.disconnect();
  }
  return el;
};

const showObserver = computed<IntersectionObserver>(() => {
  return new IntersectionObserver(([item], _observer) => {
    if (!!item) {
      if (item.isIntersecting) {
        showService.runShow(props.type, Number(props.id));
      } else {
        showService.stopShow(props.type, Number(props.id));
      }
    }
  }, SHOW_OBSERVER_OPTIONS);
});
</script>

<template>
  <div :ref="refName" class="show-observer" :class="props.class">
    <slot></slot>
  </div>
</template>
