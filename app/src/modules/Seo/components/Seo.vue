<script lang="ts" setup>
import { useHead } from "@vueuse/head";
import { computed, onActivated, onMounted, ref, watchEffect } from "vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import { SeoMetaTagsBuilder } from "@/modules/Seo/services/SeoMetaTagsBuilder";
import navigationJson from "@/assets/data/navigation.json";
import useRefCanonical from "@/modules/Seo/composables/useRefCanonical";

const props = defineProps<{
  model?: SeoModel;
}>();

const breadcrumbs = computed<object>(() => {
  const NAME_MAPPER = {
    news: "Новости",
    n: "Новости",
    trends: "Тренды",
    federal: "Федеральные новости",
    video: "Видео",
    v: "Видео",
    all: "Все",
    collection: "Подборки",
    events: "События",
    event: "События",
    clip: "Сюжеты",
    music: "Музыка",
  };

  const list: any[] = [];
  const links = window.location.pathname.split("/");
  let mergedPath = window.location.origin;
  for (let index = 0; index < links.length; index++) {
    const item = links[index];
    const name = NAME_MAPPER[item] || "Главная";

    if (index > 0 && !item) {
      break;
    } else if (index > 0 && name === "Главная") {
      list.push({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@id": window.location.href,
          name: props.model?.meta_title?.split(" - ЯRUS").shift(),
        },
      });
      break;
    } else {
      mergedPath += `${item}/`;
      list.push({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@id": mergedPath,
          name,
        },
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: list,
  };
});

const navigation = computed<object>(() => {
  const links = navigationJson.map((link, index) => ({
    "@type": "SiteNavigationElement",
    position: index + 1,
    name: link.caption,
    description: link.schemaText,
    url: window.location.href,
  }));

  return {
    "@context": "http://schema.org/",
    "@type": "ItemList",
    itemListElement: links,
  };
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({ ...props.model, breadcrumbs: breadcrumbs.value, navigation: navigation.value });
});

const seoMetaTagsBuilder = new SeoMetaTagsBuilder();
let metaTags = ref(seoMetaTagsBuilder.create(seoModel.value));

useHead(metaTags);

onMounted(() => {
  const { head } = useRefCanonical();
  useHead(head.value);
});

onActivated(() => {
  useHead(metaTags);
});

watchEffect(() => {
  metaTags.value = seoMetaTagsBuilder.create(seoModel.value);
});
</script>

<template>
  <div></div>
</template>
