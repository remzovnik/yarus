<script lang="ts" setup>
import { ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import ClipsService from "@/modules/Clips/ClipsService";
import ClipModel from "@/modules/Clips/models/ClipModel";
import { ClipGroupModel } from "@/modules/Clips/models/ClipGroupModel";
import ClipCard from "@/modules/Clips/components/ClipCard.vue";
import ClipGroupSkeleton from "@/modules/Clips/components/ClipGroupSkeleton.vue";
import { useClipStore } from "@/modules/Clips/stores/ClipStore";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ClipOriginModel } from "@/modules/Clips/models/ClipOriginModel";

const clipStore = useClipStore();

const OTHERS_LIMIT = 90;

const groupsList = ref<ClipGroupModel[]>([]);
const othersList = ref<{ type: number; model: ClipModel }[]>([]);
const isLoading = ref(true);

const fetchData = async (): Promise<void> => {
  const response = await ServiceLocator.instance.getService(ClipsService).getTop();

  groupsList.value = response[0].model.items;
  othersList.value = response.slice(1, OTHERS_LIMIT);

  clipStore.hashtagGroups = [...groupsList.value];
  clipStore.othersList = [...othersList.value.map((item) => item.model)];

  isLoading.value = false;
};

const setGroupRoute = (tag: string): RouteModel => {
  return {
    name: "clip-hashtag",
    params: { id: tag },
  };
};

const setGroupClipOrigin = (group: ClipGroupModel, groupClipIndex: number): ClipOriginModel => {
  return { type: "hashtag", id: group.tag, index: groupClipIndex };
};

const setOthersClipOrigin = (othersIndex: number): ClipOriginModel => {
  return { type: "others", index: othersIndex };
};

fetchData();
</script>

<template>
  <section v-for="(group, groupIndex) in groupsList" :key="`group-${groupIndex}`" class="clip-groups__group clips-group">
    <div class="clips-group__header">
      <div class="clips-group__header-leftside">
        <div class="clips-group__icon-wrapper">
          <BaseIcon :size="24" name="hashtag" />
        </div>
        <div class="clips-group__text">
          <h2 class="clips-group__title">{{ group.tag.slice(1) }}</h2>
          <div class="clips-group__desc">{{ group.description }}</div>
        </div>
      </div>

      <BaseButton
        class="hide-mobile"
        type="primary"
        subtype="text"
        icon="arrow2-right"
        size="large"
        is-reversed
        :route="setGroupRoute(group.tag.slice(1))"
        >Показать ещё</BaseButton
      >

      <BaseButton
        class="only-mobile"
        type="secondary"
        icon="arrow2-right"
        size="large"
        is-reversed
        :route="setGroupRoute(group.tag.slice(1))"
        aria-label="Показать ещё"
      />
    </div>

    <div class="clips-group__grid">
      <div v-for="(clip, groupClipIndex) in group.clips" :key="`group-clip-${clip.id}`" class="clips-group__cell">
        <ClipCard :model="clip" :origin="setGroupClipOrigin(group, groupClipIndex)" />
      </div>
    </div>
  </section>

  <template v-if="isLoading">
    <ClipGroupSkeleton v-for="i in 5" :key="`skeleton-${i}`" class="clip-groups__skeleton-item" />
  </template>

  <section class="clips-group clips-group_others">
    <div class="clips-group__header">
      <div class="clips-group__header-leftside">
        <div class="clips-group__icon-wrapper">
          <BaseIcon :size="24" name="hashtag" />
        </div>
        <div class="clips-group__text">
          <h2 class="clips-group__title">Другое</h2>
          <div class="clips-group__desc">Остальные хэштеги</div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading" class="clips-group__grid">
      <div v-for="(clip, othersIndex) in othersList" :key="`others-clip-${othersIndex}`" class="clips-group__cell">
        <ClipCard :model="clip.model" :origin="setOthersClipOrigin(othersIndex)" />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.clip-groups {
  &__group {
    margin-bottom: 8rem;
  }

  &__skeleton-item {
    margin-bottom: 6.4rem;
  }
}
</style>
