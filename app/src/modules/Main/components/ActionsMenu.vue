<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import RouteModel from "@/modules/Main/models/RouteModel";
import ButtonShare from "@/modules/Main/components/buttons/ButtonShare.vue";
import ButtonComplaint from "@/modules/Main/components/buttons/ButtonComplaint.vue";
import ButtonStatistics from "@/modules/Main/components/buttons/ButtonStatistics.vue";
import ButtonDelete from "@/modules/Main/components/buttons/ButtonDelete.vue";
import ButtonEdit from "@/modules/Main/components/buttons/ButtonEdit.vue";
import ButtonTag from "@/modules/Main/components/buttons/ButtonTag.vue";
import ButtonQuote from "@/modules/Main/components/buttons/ButtonQuote.vue";
import { Id, IdBigInt } from "@/_core/Base.type";
import ButtonBoring from "@/modules/Main/components/buttons/ButtonBoring.vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const props = withDefaults(
  defineProps<{
    targetId: Id | IdBigInt;
    parentId?: number | IdBigInt | null;
    ownerId?: number | IdBigInt;
    contentId?: number | string;
    contentOwnerId?: number;
    link?: RouteModel | null;
    type: EActionContentType;
    hidden?: string[];
  }>(),
  {
    link: null,
    hidden: () => [],
  }
);

const buttonsSetList = {
  audio: 1,
  video: 2,
  clip: 1,
  post: 1,
  news: 3,
  feed: 1,
  event: 1,
  commentPost: 5,
  commentNews: 5,
  commentVideo: 5,
  commentClip: 5,
  replyPost: 5,
  replyNews: 5,
  replyVideo: 5,
  replyClip: 5,
  user: 4,
  hashtag: 1,
  yarus: 6,
  seance: 6,
};

const buttonsListOwn = {
  1: ["share", "edit", "delete"],
  2: ["share", "edit", "delete"],
  3: ["share", "complaint"],
  4: ["share", "edit", "statistics"],
  5: ["tag", "quote"],
  6: ["edit", "delete"],
};

const buttonsListPublic = {
  1: ["share", "complaint", "boring"],
  2: ["share", "complaint", "boring"],
  3: ["share", "complaint", "boring"],
  4: ["share", "complaint", "statistics"],
  5: ["tag", "quote"],
  6: ["edit", "delete"],
};

const componentsList = {
  share: ButtonShare,
  complaint: ButtonComplaint,
  statistics: ButtonStatistics,
  delete: ButtonDelete,
  edit: ButtonEdit,
  tag: ButtonTag,
  quote: ButtonQuote,
  boring: ButtonBoring,
};

const buttonsList = computed<string[]>(() => {
  const setType: number = buttonsSetList[props.type];
  let result: string[] =
    (props.ownerId && authStore.isMyAccount(props.ownerId)) ||
    (props.contentOwnerId && authStore.isMyAccount(props.contentOwnerId))
      ? buttonsListOwn[setType]
      : buttonsListPublic[setType];
  result = setCommentActions(result);

  return props.hidden.length
    ? result.filter((item) => {
        const isShownBoringBoringButton = route.name !== ERouteName.MAIN_FEED ? item !== "boring" : true;
        return !props.hidden.includes(item) && isShownBoringBoringButton;
      })
    : result;
});

const url = computed<string>(() => {
  return props.link ? `${window.location.origin}${router.resolve(props.link).href}` : window.location.href;
});

const setCommentActions = (result: string[]): string[] => {
  if (buttonsSetList[props.type] === 5) {
    const isMyContent = props.contentOwnerId && authStore.isMyAccount(props.contentOwnerId);
    const isMyComment = props.ownerId && authStore.isMyAccount(props.ownerId);

    if (isMyContent && isMyComment) {
      return [...result, "edit", "delete"];
    }

    if (isMyContent && !isMyComment) {
      return [...result, "complaint", "delete"];
    }

    if (!isMyContent && isMyComment) {
      return [...result, "edit", "delete"];
    }

    if (!isMyContent && !isMyComment) {
      return [...result, "complaint"];
    }
  }

  return result;
};
</script>

<template>
  <div class="actions-menu">
    <div class="actions-menu__list">
      <component
        :is="componentsList[item]"
        v-for="(item, index) in buttonsList"
        :id="targetId"
        :key="index"
        :parent-id="parentId"
        :content-id="contentId"
        :content-type="type"
        :url="url"
      />
    </div>
  </div>
</template>

<style lang="scss">
.actions-menu {
  position: relative;
  padding: 0.8rem;
  overflow: hidden;
  background: $white-100;
  border-radius: $border-radius-sm;
  box-shadow: $box-shadow-deep;
}
</style>
