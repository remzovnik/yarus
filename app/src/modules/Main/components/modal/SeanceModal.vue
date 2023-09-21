<script lang="ts" setup>
import Datepicker from "@/modules/Main/components/datepicker/Datepicker.vue";
import { dateMaskFuture, timeMask, numberMask } from "@/_core/utils/InputMaskDefinitions";
import { reactive, ref, watchEffect, toRef } from "vue";
import SeanceModel, { SeanceFormModel } from "@/modules/Posting/models/SeanceModel";
import useVuelidate from "@vuelidate/core";
import { CreateSeanceValidationRules } from "@/modules/Posting/utils/CreateSeanceValidationRules";
import { useStore } from "@/modules/Main/stores/MainStore";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import MainService from "@/modules/Main/apiServices/MainService";
import { inputTime, setTimezoneOffset, updateTime, fromUTC, toUTC, setTimezoneOffsetBack } from "@/_core/utils/DateUtils";

const mainStore = useStore();

const props = defineProps<{
  modelValue: SeanceModel;
  submitHandler: (seance: SeanceModel, resolve: () => void, close: () => void) => void;
}>();

const ONE_DAY_IN_SECONDS = 86400;

const seance = reactive<SeanceFormModel>({ ...props.modelValue, sinceTime: "", tillTime: "" } as SeanceFormModel);
const v$ = useVuelidate(CreateSeanceValidationRules(toRef(seance, "minPrice"), toRef(seance, "maxPrice")), seance);
const isFree = ref(false);
const sinceInput = ref<{ clear: () => void }>();
const getTime = (): void => {
  if (!seance.since) return;
  ["since", "till"].forEach((el) => {
    seance[el] = setTimezoneOffset(seance[el] as number, seance.cityID, mainStore.cities);
    const time = inputTime(seance[el]);
    seance[`${el}Time`] = time;
  });
};

const setTime = (): void => {
  const date = seance.since;
  ["since", "till"].forEach((el) => {
    const time = seance[`${el}Time`].split(":").join("");
    const utcDate = toUTC(updateTime(fromUTC(date as number), time));
    const timezoneDate = setTimezoneOffsetBack(utcDate, seance.cityID, mainStore.cities);
    seance[el] = timezoneDate;
  });

  if (seance.till && seance.since && seance.till < seance.since) {
    seance.till += ONE_DAY_IN_SECONDS;
  }
};

const setPrice = (): void => {
  seance.minPrice = !seance.minPrice ? 0 : +seance.minPrice;
  seance.maxPrice = !seance.maxPrice ? 0 : +seance.maxPrice;
};

const clearSince = (): void => {
  sinceInput.value?.clear();
};

const submit = (resolve, close): void => {
  setTime();
  setPrice();
  props.submitHandler(seance, resolve, close);
};

const fetchData = async (): Promise<void> => {
  if (!mainStore.cities.length) {
    const allCities = await ServiceLocator.instance.getService(MainService).getCities();
    await mainStore.setCities(allCities);
  }
};

watchEffect(() => {
  if (isFree.value) {
    seance.minPrice = 0;
    seance.maxPrice = 0;
    seance.checkPrice = false;
  }
});

watchEffect(() => {
  if (seance.checkPrice) {
    seance.minPrice = 0;
    seance.maxPrice = 0;
    isFree.value = false;
  }
});

fetchData();
getTime();

if (seance.minPrice === 0 && seance.maxPrice === 0 && !seance.checkPrice) {
  isFree.value = true;
}
</script>

<template>
  <BaseModal
    title="Создание места"
    :are-actions-shown="true"
    submit-button-text="Сохранить"
    :is-submit-disabled="v$.$invalid"
    :submit-handler="submit"
  >
    <template #content>
      <section id="seance-modal" class="seance-modal">
        <div class="seance-modal__fieldset">
          <p class="seance-modal__fieldset-label">Город события</p>
          <div class="seance-modal__fieldset-field">
            <BaseSelect
              v-model="seance.cityID"
              :list="mainStore.cities"
              label="Название города"
              autocomplete
              :has-error="v$.cityID.$error"
              :error-message="(v$.cityID.$errors[0]?.$message as string)"
            />
          </div>
        </div>

        <div class="seance-modal__fieldset">
          <p class="seance-modal__fieldset-label">Место проведения</p>
          <div class="seance-modal__fieldset-field">
            <BaseInput
              v-model="seance.address"
              label="Адрес"
              :has-error="v$.address.$error"
              :error-message="(v$.address.$errors[0]?.$message as string)"
            />
          </div>
        </div>

        <div class="seance-modal__fieldset seance-modal__fieldset_date">
          <p class="seance-modal__fieldset-label">Дата проведения</p>
          <div class="seance-modal__fieldset-field">
            <Datepicker
              v-model="seance.since"
              :is-range="false"
              is-future
              teleport="#seance-modal"
              teleport-center
              @clear-value="clearSince"
            >
              <template #db-input="{ events: { click, focus } }">
                <BaseInput
                  ref="sinceInput"
                  v-model="seance.since"
                  :mask="dateMaskFuture"
                  type="datepicker"
                  placeholder="Дата"
                  :has-error="v$.since.$error"
                  :error-message="(v$.since.$errors[0]?.$message as string)"
                  @click="click"
                  @focus="focus"
                />
              </template>
            </Datepicker>
          </div>
        </div>

        <div class="seance-modal__fieldset seance-modal__fieldset_time">
          <p class="seance-modal__fieldset-label">Время проведения</p>
          <div class="seance-modal__fieldset-field">
            <BaseInput
              v-model="seance.sinceTime"
              label="Время с"
              :mask="timeMask"
              :has-error="v$.sinceTime.$error"
              :error-message="(v$.sinceTime.$errors[0]?.$message as string)"
            />
            <BaseInput
              v-model="seance.tillTime"
              label="Время до"
              :mask="timeMask"
              :has-error="v$.tillTime.$error"
              :error-message="(v$.tillTime.$errors[0]?.$message as string)"
            />
          </div>
        </div>

        <div v-if="!(isFree || seance.checkPrice)" class="seance-modal__fieldset seance-modal__fieldset_price">
          <p class="seance-modal__fieldset-label">Цена</p>
          <div class="seance-modal__fieldset-field">
            <BaseInput
              v-model="seance.minPrice"
              label="Цена от"
              :mask="numberMask"
              :has-error="v$.minPrice.$error"
              :error-message="(v$.minPrice.$errors[0]?.$message as string)"
            />
            <BaseInput
              v-model="seance.maxPrice"
              label="Цена до"
              :mask="numberMask"
              :has-error="v$.maxPrice.$error"
              :error-message="(v$.maxPrice.$errors[0]?.$message as string)"
            />
          </div>
        </div>

        <div class="seance-modal__fieldset seance-modal__fieldset_check-price">
          <div class="seance-modal__fieldset-field">
            <BaseSwitcher v-model="seance.checkPrice">Уточнить в кассах</BaseSwitcher>
            <BaseSwitcher v-model="isFree">Событие бесплатное</BaseSwitcher>
          </div>
        </div>
      </section>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.seance-modal {
  &__fieldset {
    margin-bottom: 2.4rem;

    &_time,
    &_price,
    &_check-price {
      .seance-modal__fieldset-field {
        display: grid;
        grid-column-gap: 1.6rem;
        grid-template-columns: 1fr 1fr;
      }
    }

    &_check-price {
      margin-top: 4rem;
      margin-bottom: 0;

      @media (max-width: $media-md) {
        .seance-modal__fieldset-field {
          grid-gap: 1.6rem 0;
          grid-template-columns: 1fr;
        }
      }
    }

    &-label {
      margin-bottom: 1.6rem;

      @include headline-16;

      color: $gray-600;
    }
  }
}
</style>
