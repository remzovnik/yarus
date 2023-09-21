<script lang="ts" setup>
import ContentItemModel from "@/modules/Posting/models/ContentItemModel";
import { useBreakpoints } from "@vueuse/core";
import { computed, ref } from "vue";
import { PostingContentTypeId } from "@/modules/Posting/models/PostingContentType";
import EditContentOrderModel from "@/modules/Posting/models/EditContentOrderModel";
import { appConfig } from "@/appConfig";

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile, tablet: appConfig.widthTablet });

const props = defineProps<{
  model: ContentItemModel;
  isControlsAvailable: boolean;
  isDisabled: boolean;
}>();

const emit = defineEmits<{
  (event: "order", payload: EditContentOrderModel): void;
  (event: "delete", id: number): void;
}>();

const isDesktop = breakpoints.greater("tablet");
const rootEl = ref<any>();

const upArrowClickHandler = (): void => {
  emit("order", {
    direction: -1,
    id: props.model.id,
  });
};

const downArrowClickHandler = (): void => {
  emit("order", {
    direction: 1,
    id: props.model.id,
  });
};

const deleteClickHandler = (): void => {
  emit("delete", props.model.id);
};

const contentClasses = computed<string>(() => {
  return `edit-content-item__content edit-content-item__content_${PostingContentTypeId[props.model.type]}`;
});
</script>

<template>
  <li ref="rootEl" class="edit-content-item show-animation" :data-edit-content-id="model.id">
    <div class="edit-content-item__main">
      <div v-visible="isControlsAvailable" class="edit-content-item__controls edit-content-item__controls_primary">
        <div class="edit-content-item__controls-inner" :class="isDisabled ? 'edit-content-item__controls-inner_disabled' : ''">
          <BaseIcon
            class="edit-content-item-control edit-content-item-control_arrow-up"
            name="arrow-up"
            :size="24"
            @click="upArrowClickHandler"
          />

          <BaseIcon
            v-if="isDesktop"
            class="edit-content-item-control edit-content-item-control_handle js-edit-content-drag-handle"
            name="handle"
            :size="24"
          />

          <BaseIcon
            class="edit-content-item-control edit-content-item-control_arrow-down"
            name="arrow-down"
            :size="24"
            @click="downArrowClickHandler"
          />
        </div>
      </div>
      <div :class="contentClasses">
        <div class="edit-content-item__content-inner">
          <slot name="content" />
        </div>
      </div>
      <div v-visible="isControlsAvailable" class="edit-content-item__controls edit-content-item__controls_secondary">
        <div class="edit-content-item__controls-inner">
          <BaseIcon
            class="edit-content-item-control edit-content-item-control_delete"
            name="delete"
            :size="18"
            @click="deleteClickHandler"
          />
        </div>
      </div>
    </div>
    <div class="edit-content-item__footer">
      <slot name="footer" />
    </div>
  </li>
</template>

<style lang="scss">
.edit-content-item {
  $indent: 1.6rem;

  position: relative;
  margin-bottom: 1rem;
  animation-duration: 0.7s;

  &__main {
    position: relative;
    display: flex;
    align-items: stretch;
    min-height: 6.6rem;

    @media (max-width: $media-sm) {
      flex-wrap: wrap;
    }
  }

  &__controls {
    color: $gray-400;

    &_primary {
      margin-right: $indent;

      @media (max-width: $media-md) {
        order: 2;
        margin-right: 0;
        margin-left: $indent;
      }

      @media (max-width: $media-sm) {
        order: 1;
        width: 50%;
        margin-right: 0;
        margin-left: 0;
      }

      .edit-content-item__controls-inner {
        @media (max-width: $media-sm) {
          flex-direction: row;
          justify-content: flex-start;
        }
      }
    }

    &_secondary {
      margin-left: $indent;

      @media (max-width: $media-md) {
        position: absolute;
        top: 50%;
        right: 0.3rem;
        margin-left: 0;
        transform: translateY(-50%);
      }

      @media (max-width: $media-sm) {
        position: static;
        top: auto;
        right: auto;
        order: 2;
        width: 50%;
        margin-right: 0;
        margin-left: 0;
        transform: none;
      }

      .edit-content-item__controls-inner {
        justify-content: center;

        @media (max-width: $media-sm) {
          flex-direction: row;
          justify-content: flex-end;
        }
      }
    }
  }

  &__controls-inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-height: 100%;

    &_disabled {
      user-select: none;
      pointer-events: none;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1.6rem;
    border-radius: $border-radius-sm;

    &:hover {
      background-color: $gray-100;
    }

    @media (max-width: $media-md) {
      order: 1;
      padding: 0;

      &:hover {
        background-color: $gray-100;
      }
    }

    @media (max-width: $media-sm) {
      order: 3;
      padding: 0;

      &:hover {
        background-color: $gray-100;
      }
    }

    &_link {
      padding: 0;
    }
  }

  &__content-inner {
    width: 100%;
  }
}

.edit-content-item-control {
  cursor: pointer;

  &:hover {
    color: $gray-900;
  }

  &_handle {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    & > * {
      pointer-events: none;
    }
  }
}
</style>
