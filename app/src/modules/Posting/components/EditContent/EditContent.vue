<script lang="ts" setup>
import Menu from "@/modules/Posting/components/EditContent/EditContentMenu.vue";
import ItemWrapper from "@/modules/Posting/components/EditContent/EditContentItemWrapper.vue";
import Title from "@/modules/Posting/components/EditContent/EditContentTitle.vue";
import Text from "@/modules/Posting/components/EditContent/EditContentText.vue";
import Quote from "@/modules/Posting/components/EditContent/EditContentQuote.vue";
import Link from "@/modules/Posting/components/EditContent/EditContentLink.vue";
import ImageUpload from "@/modules/Main/components/form/ImageUpload.vue";
import AudioUpload from "@/modules/Main/components/form/AudioUpload.vue";
import VideoUpload from "@/modules/Main/components/form/VideoUpload.vue";
import { useBreakpoints } from "@vueuse/core";
import { ref, computed, watch, nextTick } from "vue";
import ContentItemModel from "@/modules/Posting/models/ContentItemModel";
import { PostingContentType } from "@/modules/Posting/models/PostingContentType";
import EditContentOrderModel from "@/modules/Posting/models/EditContentOrderModel";
import EditContentErrorChangeModel from "@/modules/Posting/models/EditContentErrorChnageModel";
import { PostingContentActionType } from "@/modules/Posting/models/PostingContentActionType";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { appConfig } from "@/appConfig";
import * as Draggable from "vuedraggable";
import { usePostingStore } from "@/modules/Posting/store/PostingStore";

const breakpoints = useBreakpoints({ mobile: appConfig.widthMobile, tablet: appConfig.widthTablet });

const authStore = useAuthStore();
const postingStore = usePostingStore();

const emit = defineEmits<{
  (event: "update:modelValue", modelValue: any[]): void;
  (event: "errorChange", EditContentErrorChangeModel): void;
}>();

const props = defineProps<{
  modelValue: any[];
}>();

const activeItemId = ref<number | null>(null);
const itemIdCounter = ref<number>(0);
const disabledDragList = ref<number[]>([]);
const isUploaderDisabled = ref(false);

const itemsList = ref<ContentItemModel[]>(
  props.modelValue.length
    ? props.modelValue
    : [
        {
          id: ++itemIdCounter.value,
          type: PostingContentType.TITLE,
          action: PostingContentActionType.new,
          data: null,
        },
        {
          id: ++itemIdCounter.value,
          type: PostingContentType.TEXT,
          action: PostingContentActionType.new,
          data: null,
        },
      ]
);
const isMobile = breakpoints.smaller("mobile");

const addNewItemHandler = async (options): Promise<void> => {
  let index = itemsList.value.findIndex((item) => item.id === options.parentId);
  if (index < 0) {
    index = itemsList.value.length;
  } else {
    index++;
  }

  itemsList.value.splice(index, 0, {
    id: ++itemIdCounter.value,
    type: options.type,
    action: postingStore.isEditing ? PostingContentActionType.add : PostingContentActionType.new,
    data: null,
  } as ContentItemModel);

  if (document) {
    await nextTick();
    const newItem: HTMLElement | null = document.querySelector(`[data-edit-content-id="${itemIdCounter.value}"]`);

    if (newItem && newItem.getBoundingClientRect().bottom > document.documentElement.clientHeight) {
      newItem.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }
};

const itemMouseoverHandler = (id: number): void => {
  activeItemId.value = id;
};

const itemsListMouseLeaveHandler = (): void => {
  activeItemId.value = null;
};

const itemDeleteHandler = (id: number): void => {
  const index = itemsList.value.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }
  activeItemId.value = null;
  itemsList.value.splice(index, 1);
  emit("errorChange", { id, value: false });
};

const orderHandler = (options: EditContentOrderModel): void => {
  const index = itemsList.value.findIndex((item) => item.id === options.id);
  if (index < 0) {
    return;
  }
  const maxIndex = itemsList.value.length - 1;
  let targetIndex;
  if (options.direction < 0) {
    targetIndex = index === 0 ? maxIndex : index - 1;
  } else {
    targetIndex = index === maxIndex ? 0 : index + 1;
  }

  itemsList.value[index] = itemsList.value.splice(targetIndex, 1, itemsList.value[index])[0];
};

const dragDisabledHandler = (id, value): void => {
  const index = disabledDragList.value.indexOf(id);

  if (value && index < 0) {
    disabledDragList.value.push(id);
    emit("errorChange", { id, value: true });
  } else if (!value && index >= 0) {
    disabledDragList.value.splice(index, 1);
    emit("errorChange", { id, value: false });
  }
};

const errorChangeHandler = (id: number, value: boolean): void => {
  emit("errorChange", { id, value });
};

const isControlsAvailable = computed<boolean>(() => {
  return itemsList.value.length > 1;
});

const isDisabled = computed<boolean>(() => {
  return !!disabledDragList.value.length;
});

watch(
  () => itemsList.value,
  async (newValue) => {
    emit("update:modelValue", newValue);
  },
  {
    deep: true,
  }
);
</script>

<template>
  <div class="edit-content" @mouseleave="itemsListMouseLeaveHandler">
    <Draggable
      v-model="itemsList"
      tag="ul"
      group="items"
      item-key="id"
      handle=".js-edit-content-drag-handle"
      :disabled="isDisabled"
      @end="isUploaderDisabled = false"
      @start="isUploaderDisabled = true"
    >
      <template #item="{ element }">
        <ItemWrapper
          :model="element"
          :is-controls-available="isControlsAvailable"
          :is-disabled="isDisabled"
          @mouseover="itemMouseoverHandler(element.id)"
          @order="orderHandler"
          @delete="itemDeleteHandler"
        >
          <template #content>
            <Title v-if="element.type === PostingContentType.TITLE" v-model="element.data" />
            <Text v-if="element.type === PostingContentType.TEXT" v-model="element.data" />
            <ImageUpload
              v-if="element.type === PostingContentType.IMAGE"
              :data="element.data?.image || null"
              :is-disabled="isUploaderDisabled"
              overlay
              @update="(newValue) => (element.data = { image: newValue })"
              @loadstart="dragDisabledHandler(element.id, true)"
              @loadend="dragDisabledHandler(element.id, false)"
              @error-value-change="errorChangeHandler(element.id, $event)"
            />
            <AudioUpload
              v-if="element.type === PostingContentType.AUDIO"
              :data="element.data || null"
              :default-author="authStore.fullName"
              :is-disabled="isUploaderDisabled"
              @update="(newValue) => (element.data = newValue)"
              @loadstart="dragDisabledHandler(element.id, true)"
              @loadend="dragDisabledHandler(element.id, false)"
              @error-value-change="errorChangeHandler(element.id, $event)"
            />
            <VideoUpload
              v-if="element.type === PostingContentType.VIDEO"
              :data="element.data || null"
              :is-disabled="isUploaderDisabled"
              overlay
              @update="(newValue) => (element.data = newValue)"
              @loadstart="dragDisabledHandler(element.id, true)"
              @loadend="dragDisabledHandler(element.id, false)"
              @error-value-change="errorChangeHandler(element.id, $event)"
            />
            <Quote
              v-if="element.type === PostingContentType.QUOTE"
              v-model="element.data"
              @error-value-change="errorChangeHandler(element.id, $event)"
            />
            <Link
              v-if="element.type === PostingContentType.LINK"
              v-model="element.data"
              @error-value-change="errorChangeHandler(element.id, $event)"
            />
          </template>
          <template #footer>
            <Menu v-if="element.id === activeItemId && !isMobile" :parent-id="element.id" @add="addNewItemHandler" />
          </template>
        </ItemWrapper>
      </template>
    </Draggable>
    <Menu v-if="!activeItemId || isMobile" :parent-id="null" @add="addNewItemHandler" />
  </div>
</template>
