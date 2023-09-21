<script lang="ts" setup>
import SeanceModel from "@/modules/Posting/models/SeanceModel";
import ActionsMenu from "@/modules/Main/components/ActionsMenu.vue";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import { useStore } from "@/modules/Main/stores/MainStore";
import { seanceCreateDate, setTimezoneOffset } from "@/_core/utils/DateUtils";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MainService from "@/modules/Main/apiServices/MainService";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";

const authStore = useAuthStore();
const mainStore = useStore();

const emit = defineEmits(["click"]);

defineProps<{
  id?: number;
  seance?: SeanceModel;
}>();

const seanceCreatePrice = (seance: SeanceModel): string => {
  if (!seance) return "";
  else if (seance.checkPrice) {
    return "уточнить в кассе";
  } else if (!seance.minPrice && !seance.maxPrice) {
    return "бесплатно";
  } else if (seance.minPrice && seance.maxPrice) {
    return `${seance.minPrice}₽ - ${seance.maxPrice}₽`;
  } else if (seance.minPrice && !seance.maxPrice) {
    return `${seance.minPrice}₽`;
  } else if (!seance.minPrice && seance.maxPrice) {
    return `0₽ - ${seance.maxPrice}₽`;
  } else return "";
};

const fetchData = async (): Promise<void> => {
  if (!mainStore.cities.length) {
    const allCities = await ServiceLocator.instance.getService(MainService).getCities();
    await mainStore.setCities(allCities);
  }
};

fetchData();
</script>

<template>
  <div v-if="!seance" class="seance-upload seance-upload_state_ready" @click="emit('click')">
    <BaseIcon class="seance-upload__icon" name="upload" :size="40" />
    <span class="seance-upload__message">Добавить новое место</span>
  </div>

  <div v-if="seance && id !== undefined" class="seance-upload seance-upload_state_uploaded">
    <div class="seance-upload__header">
      <p class="seance-upload__address">{{ seance.address }}</p>

      <VDropdown :skidding="-20">
        <BaseButton type="transparent" size="large" aria-label="Действия с карточкой" icon="dots-vertical" />
        <template #popper="{ hide }">
          <ActionsMenu :target-id="id" :owner-id="authStore.sessionUser?.id" :type="EActionContentType.SEANCE" @click="hide" />
        </template>
      </VDropdown>
    </div>

    <p class="seance-upload__city">{{ mainStore.getCityById(seance.cityID)?.name || "" }}</p>
    <p class="seance-upload__date">
      {{
        seanceCreateDate([
          setTimezoneOffset(seance.since as number, seance.cityID, mainStore.cities),
          setTimezoneOffset(seance.till as number, seance.cityID, mainStore.cities),
        ])
      }}
    </p>
    <p class="seance-upload__price">{{ seanceCreatePrice(seance) }}</p>
  </div>
</template>

<style lang="scss">
.seance-upload {
  display: flex;
  flex-direction: column;
  width: 26.4rem;
  height: 20.6rem;
  border-radius: $border-radius-md;
  cursor: pointer;

  &__message {
    margin-top: 1.6rem;

    @include body-16;

    color: $gray-600;
    text-align: center;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-self: stretch;
    justify-content: space-between;
    margin-bottom: 0.8rem;
  }

  &__address,
  &__price {
    @include headline-18;

    color: $gray-600;
  }

  &__city {
    margin-bottom: 0.8rem;

    @include body-16;

    color: $gray-500;
  }

  &__date {
    @include label-16;

    color: $gray-600;
  }

  &__price {
    margin-top: auto;
    margin-bottom: 0.8rem;
  }

  &_state {
    &_ready {
      align-items: center;
      justify-content: center;
      padding: 5rem;
      border: 1px solid $gray-400;

      &:hover {
        border-color: $gray-500;
      }
    }

    &_uploaded {
      align-items: stretch;
      justify-content: flex-start;
      padding: 1.6rem;
      background: $gray-100;
    }
  }
}
</style>
