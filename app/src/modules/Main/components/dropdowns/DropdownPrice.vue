<script lang="ts" setup>
import { ref } from "vue";

const emit = defineEmits(["select", "close"]);

const props = defineProps<{
  priceValue?: boolean;
}>();

const selectedPrice = ref<boolean>();

const selectPrice = (value: boolean): void => {
  selectedPrice.value = value;
};

const savePrice = (): void => {
  emit("close");
  emit("select", selectedPrice.value);
};

const clearPrice = (): void => {
  emit("close");
  emit("select", null);
};

const closeDropdownHandler = (): void => {
  emit("close");
};
</script>

<template>
  <div class="dropdown-filter dropdown-filter_price">
    <div class="dropdown-filter__content">
      <h2 class="dropdown-filter__title">Цена</h2>
      <label class="dropdown-filter-item dropdown-filter__item">
        <div>
          <div class="dropdown-filter-item__title">Все</div>
        </div>

        <input
          class="dropdown-filter-item__radio"
          type="radio"
          name="cities"
          :checked="priceValue === false"
          @input="selectPrice(false)"
        />
        <div class="dropdown-filter-item__radio-view"></div>
      </label>
      <label class="dropdown-filter-item dropdown-filter__item">
        <div>
          <div class="dropdown-filter-item__title">Бесплатные</div>
        </div>

        <input class="dropdown-filter-item__radio" type="radio" name="cities" :checked="priceValue" @input="selectPrice(true)" />
        <div class="dropdown-filter-item__radio-view"></div>
      </label>
    </div>

    <div class="dropdown-filter__controls">
      <BaseButton class="dropdown-filter__button" type="secondary" @click="clearPrice">Очистить</BaseButton>
      <BaseButton class="dropdown-filter__button" @click="savePrice">Сохранить</BaseButton>
    </div>

    <BaseButton class="dropdown-filter__close" icon="close" type="transparent" @click="closeDropdownHandler" />
  </div>
</template>
