<script lang="ts" setup>
import { computed } from "vue";
import CityModel from "@/modules/Main/models/CityModel";
import { cityInCase } from "@/_core/utils/Formaters";
import SeoModel from "@/modules/Seo/models/SeoModel";
import Seo from "@/modules/Seo/components/Seo.vue";
import { CaseType } from "@/_core/models/CaseType";

const props = defineProps<{ city: CityModel | undefined }>();

const cityNameInNominativeCase = computed<string>(() => {
  return props.city?.name || "";
});

const cityNameInGenitiveCase = computed<string>(() => {
  return props.city ? cityInCase(props.city, CaseType.GENITIVE) : "";
});

const metaTitle = computed<string>(() => {
  return `Новости ${cityNameInGenitiveCase.value} - ЯRUS ${cityNameInNominativeCase.value}`;
});

const metaDescription = computed<string>(() => {
  return `Актуальные новости ${cityNameInGenitiveCase.value}, федеральные новости в социальной сети ЯRUS.`;
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image_alt: "Новости",
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
