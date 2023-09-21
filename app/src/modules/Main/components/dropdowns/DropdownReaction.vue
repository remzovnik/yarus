<script lang="ts" setup>
import { defineAsyncComponent, ref } from "vue";
import { Id } from "@/_core/Base.type";

const Vue3Lottie = defineAsyncComponent(() => import("vue3-lottie").then((response) => response.Vue3Lottie));
const smiles = ref<any[]>([]);

const emit = defineEmits<{
  (e: "click", payload: Id): void;
  (e: "close", payload: void): void;
}>();

const smilesPathList = ["SmileLike", "SmileHappy", "SmileSad", "SmileWow", "SmileAngry"];

const load = async (): Promise<void> => {
  for (let index = 0; index < smilesPathList.length; index++) {
    const path = smilesPathList[index];
    const item = await import(`./../../../../assets/smiles/${path}.json`);
    smiles.value.push({
      id: index + 1,
      item: item.default,
    });
  }
};

const clickHandler = (e: Id): void => {
  emit("click", e);
  emit("close");
};

load();
</script>

<template>
  <div class="dropdown-reaction">
    <div v-for="smile in smiles" :key="smile.id" class="dropdown-reaction__smile" @click="clickHandler(smile.id)">
      <Vue3Lottie v-if="!!smile.item" :animation-data="smile.item" :loop="1" />
    </div>
  </div>
</template>

<style lang="scss">
.dropdown-reaction {
  display: flex;
  align-items: center;
  height: 4rem;
  background: $white-100;
  border-radius: 8rem;
  box-shadow: $box-shadow-soft;

  &__smile {
    width: 5rem;
    height: 5rem;
    margin-right: -0.5rem;
    margin-left: -0.5rem;
    cursor: pointer;
    transition: transform $trs-forward;

    &:hover {
      transform: scale(1.2) translateY(-5%);
      transition: transform $trs-back;
    }
  }
}
</style>
