<script lang="ts" setup>
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { ref } from "vue";
import AlertService from "@/modules/Main/apiServices/AlertService";
import { ResponseType } from "@/modules/Main/models/ResponseModel";

interface IAlarm {
  show: boolean;
  text: string;
  background_color: string;
  text_color: string;
}

const alarm = ref<IAlarm>({} as IAlarm);
const isAlarmShown = ref(false);

const fetchData = async (): Promise<void> => {
  const response = await ServiceLocator.instance.getService(AlertService).getAlert();

  if (response.status === ResponseType.OK) {
    alarm.value = response.message;
    isAlarmShown.value = true;
  } else {
    alarm.value = {} as IAlarm;
    isAlarmShown.value = false;
  }
};

const closeAlarm = (): void => {
  isAlarmShown.value = false;
};

fetchData();
</script>

<template>
  <div v-if="isAlarmShown && alarm.show" class="alarm">
    {{ alarm.text }}

    <BaseButton class="alarm__close" icon="close" type="transparent" @click.prevent="closeAlarm" />
  </div>
</template>

<style lang="scss">
.alarm {
  position: relative;
  width: calc(18rem + 112.8rem + 3.2rem);
  margin: 1.6rem auto;
  padding: 1.6rem 6rem 1.6rem 1.6rem;
  color: $gray-900;
  background: $red-300;
  border-radius: $border-radius-md;

  @media (max-width: $media-lg) {
    width: calc(18rem + 89.6rem + 2.4rem);
  }

  @media (max-width: $media-md) {
    width: calc(9.6rem + 56.1rem + 3.2rem);
  }

  @media (max-width: $media-sm) {
    width: 100%;
    margin-left: 0;
    border-radius: 0;
  }

  &__close {
    position: absolute;
    top: 1.3rem;
    right: 1.6rem;
    z-index: 2;

    @media (max-width: $media-sm) {
      right: 3.2rem;
    }
  }
}
</style>
