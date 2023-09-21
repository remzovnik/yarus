<script lang="ts" setup>
import ymaps from "ymaps";
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    longitude: number;
    latitude: number;
    zoom?: number;
    pointType?: string;
    color?: string;
  }>(),
  {
    zoom: 15,
    pointType: "islands#icon",
    color: "#ff0000",
  }
);

const API_URL = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";

const mapContainer = ref();

onMounted(() => {
  ymaps.load(API_URL).then((maps) => {
    const map = new maps.Map(mapContainer.value, {
      center: [props.latitude, props.longitude],
      zoom: props.zoom,
      controls: ["zoomControl"],
    });
    const myGeoObject = new maps.Placemark(
      [props.latitude, props.longitude],
      {},
      {
        preset: props.pointType,
        iconColor: props.color,
      }
    );
    map.geoObjects.add(myGeoObject);
  });
});
</script>

<template>
  <div ref="mapContainer" class="common-ymaps"></div>
</template>

<style lang="scss">
.common-ymaps {
  width: 100%;
  height: 100%;
}
</style>
