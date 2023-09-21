<script lang="ts" setup>
import { computed } from "vue";
import EventModel from "@/modules/Events/models/EventModel";
import EventNormalizedSeanceModel from "@/modules/Events/models/EventNormalizedSeanceModel";
import { inputDate, ISODateShort } from "@/_core/utils/DateUtils";
import { cityInCase } from "@/_core/utils/Formaters";
import { Original } from "@/modules/Events/models/EventImagesModel";
import Seo from "@/modules/Seo/components/Seo.vue";
import SeoModel from "@/modules/Seo/models/SeoModel";
import { CaseType } from "@/_core/models/CaseType";

const props = defineProps<{ model: EventModel; seance: EventNormalizedSeanceModel | undefined }>();

const title = computed<string>(() => {
  let title = props.model.name;

  if (props.seance?.since && props.seance?.city) {
    const date = inputDate(props.seance.since);
    title += ` в ${cityInCase(props.seance.city, CaseType.PREPOSITIONAL)}`;
    title += `, ${date}`;
  }

  return title;
});

const metaTitle = computed<string>(() => {
  return title.value ? `${title.value} - ЯRUS` : "ЯRUS";
});

const metaDescription = computed<string>(() => {
  let description = `${title.value}. Все события `;

  if (props.seance?.city) {
    description += cityInCase(props.seance.city, CaseType.GENITIVE);
  }

  return `${description} в социальной сети ЯRUS.`;
});

const image = computed<Original | undefined>(() => {
  return props.model.images?.length ? props.model.images[0].original : undefined;
});

const metaImage = computed<string | undefined>(() => {
  return image.value?.url;
});

const metaImageWidth = computed<string | undefined>(() => {
  return image.value?.width.toString();
});

const metaImageHeight = computed<string | undefined>(() => {
  return image.value?.height.toString();
});

const event = computed<any>(() => {
  const data: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: props.model.name,
    offers: {
      "@type": "Offer",
      price: props.model.minPrice?.toFixed(2),
      priceCurrency: "RUB",
      url: window.location.href,
    },
  };

  if (props.seance) {
    data.startDate = ISODateShort(props.seance.since);
    data.location = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: props.seance.city.name || "Россия",
        streetAddress: props.seance.address,
      },

      name: props.seance.placeName,
    };
  }

  return data;
});

const seoModel = computed<SeoModel>(() => {
  return new SeoModel({
    meta_title: metaTitle.value,
    meta_description: metaDescription.value,
    meta_image: metaImage.value,
    meta_image_alt: "События",
    meta_image_width: metaImageWidth.value,
    meta_image_height: metaImageHeight.value,
    event: event.value,
  });
});
</script>

<template>
  <Seo :model="seoModel" />
</template>
