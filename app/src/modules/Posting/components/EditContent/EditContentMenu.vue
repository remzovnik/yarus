<script lang="ts" setup>
import { contentTypesConfig } from "@/modules/Posting/components/EditContent/config";
import { Swiper, SwiperSlide } from "swiper/vue";

const emit = defineEmits(["add"]);

const props = defineProps<{
  parentId: number | null;
}>();

const itemClickHandler = (type: string): void => {
  emit("add", {
    type,
    parentId: props.parentId,
  });
};
</script>

<template>
  <ul class="edit-content-menu">
    <swiper :slides-per-view="'auto'" :space-between="24" :lazy="true">
      <swiper-slide v-for="(item, index) in contentTypesConfig" :key="index">
        <li class="edit-content-menu-item" @click="itemClickHandler(item.type)">
          <BaseIcon class="edit-content-menu-item__icon" :name="item.icon" :size="20" />
          <p class="edit-content-menu-item__title">
            {{ item.title }}
          </p>
        </li>
      </swiper-slide>
    </swiper>
  </ul>
</template>

<style lang="scss">
.edit-content-menu {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 2.4rem;
  padding-top: 1.4rem;
  border-top: 1px solid $gray-400;

  .swiper {
    margin: 0;

    .swiper-slide {
      width: auto;
    }
  }
}

.edit-content-menu-item {
  text-align: center;
  cursor: pointer;

  &:hover {
    color: $blue-200;
  }

  &__icon {
    display: inline-block;
  }

  &__title {
    @include body-14;
  }
}
</style>
