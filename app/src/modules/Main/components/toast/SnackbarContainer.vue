<script setup lang="ts">
import { ref, watch } from "vue";
import SnackbarComponent from "@/modules/Main/components/toast/SnackbarMessage.vue";

const props = defineProps<{ notify?: any }>();

const toastItemList = ref<any[]>([]);

const closeNotify = (id: number) => {
  const index = toastItemList.value.findIndex((item) => item.id === id);
  if (index >= 0) {
    toastItemList.value.splice(index, 1);
  }
};

watch(
  () => props.notify,
  (value) => {
    if (!!value) {
      toastItemList.value.push(value);
    }
  },
  { immediate: true }
);
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <Teleport to="body">
    <div id="snackbar-container" class="snackbar-container">
      <SnackbarComponent v-for="item in toastItemList" v-bind="item" :key="item.id" @close="closeNotify(item.id)" />
    </div>
  </Teleport>
</template>

<style lang="scss">
.snackbar-container {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  max-width: 475px;
  max-height: 90vh;
  padding: 1.4rem 0.8rem 0.8rem 1.4rem;
  overflow: auto;
}
</style>
