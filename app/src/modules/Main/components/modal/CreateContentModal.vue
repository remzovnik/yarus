<script lang="ts" setup>
import { computed, ref } from "vue";
import { Router, useRouter } from "vue-router";
import RouteModel from "@/modules/Main/models/RouteModel";
import PickItem from "@/modules/Main/components/form/PickItem.vue";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import useYarusBreakpoints from "@/modules/Main/composables/useYarusBreakpoints";
import { EContentTypeId } from "@/modules/Main/infrastructure/CreateContentModal/EContentTypeId.enum";

interface ContentTypeInfo {
  id: number;
  icon: string;
  title: string;
  desc: string;
}

const props = withDefaults(
  defineProps<{
    list?: any;
  }>(),
  {
    list: [
      EContentTypeId.POST,
      EContentTypeId.IMAGE,
      EContentTypeId.VIDEO,
      EContentTypeId.CLIP,
      EContentTypeId.EVENT,
      EContentTypeId.TRANSLATION,
    ],
  }
);

const router: Router = useRouter();
const activeId = ref<EContentTypeId>(EContentTypeId.POST);
const { isTablet } = useYarusBreakpoints();

const ContentTypeItems: ContentTypeInfo[] = [
  { id: EContentTypeId.POST, icon: "post", title: "Добавить статью", desc: "Заметка, рассказ любой длины" },
  { id: EContentTypeId.IMAGE, icon: "image", title: "Добавить фото", desc: "Изображение с коротким описанием" },
  { id: EContentTypeId.VIDEO, icon: "video", title: "Добавить видео", desc: "До 3-х часов" },
  {
    id: EContentTypeId.TRANSLATION,
    icon: "video",
    title: "Добавить трансляцию",
    desc: "Возможно только с программами для потокового вещания",
  },
  { id: EContentTypeId.CLIP, icon: "clip", title: "Добавить сюжет", desc: "Вертикальное видео до 60 секунд" },
  { id: EContentTypeId.EVENT, icon: "event", title: "Создать событие", desc: "Ваше мероприятие" },
];

const create = (resolve, close): void => {
  switch (activeId.value) {
    case EContentTypeId.POST: {
      const route: RouteModel = { name: ERouteName.POST_CREATE };
      router.push(route);
      break;
    }

    case EContentTypeId.IMAGE: {
      const route: RouteModel = { name: ERouteName.PHOTO_CREATE };
      router.push(route);
      break;
    }

    case EContentTypeId.VIDEO: {
      const route: RouteModel = { name: ERouteName.VIDEO_CREATE };
      router.push(route);
      break;
    }

    case EContentTypeId.CLIP: {
      const route: RouteModel = { name: ERouteName.CLIP_CREATE };
      router.push(route);
      break;
    }

    case EContentTypeId.EVENT: {
      const route: RouteModel = { name: ERouteName.EVENT_CREATE };
      router.push(route);
      try {
        /*global ym*/
        //@ts-ignore
        ym(74194660, "reachGoal", "create_event");
        // eslint-disable-next-line no-empty
      } catch {}
      // todo требует починки, см. main.ts
      // $metrika.reachGoal("create_event");

      break;
    }
    case EContentTypeId.TRANSLATION: {
      const route: RouteModel = { name: ERouteName.TRANSLATION_CREATE };
      router.push(route);
      break;
    }

    default:
      break;
  }
  resolve();
  close();
};

const pickType = (id: number): void => {
  activeId.value = id;
};

const currentItems = computed<ContentTypeInfo[]>(() => {
  return ContentTypeItems.filter(
    (item) => props.list.includes(item.id) && (isTablet.value ? item.id !== EContentTypeId.TRANSLATION : true)
  );
});
</script>

<template>
  <BaseModal title="Что вы хотите создать?" :are-actions-shown="true" submit-button-text="Создать" :submit-handler="create">
    <template #content>
      <PickItem
        v-for="item in currentItems"
        :key="item.id"
        :icon="item.icon"
        :description="item.desc"
        :title="item.title"
        :value="item.id"
        :is-active="item.id === activeId"
        @on-select="pickType"
      />
    </template>
  </BaseModal>
</template>
