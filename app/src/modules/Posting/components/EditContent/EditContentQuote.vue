<script lang="ts" setup>
import QuoteModel from "@/modules/Posting/models/QuoteModel";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { computed, inject, onBeforeUnmount, ref, watch } from "vue";
import { eventsConfig } from "@/appConfig";

const emitter: any = inject("emitter");

const emit = defineEmits<{
  (event: "update:modelValue", modelValue: QuoteModel): void;
  (event: "errorValueChange", value: boolean): void;
}>();

const props = defineProps<{
  modelValue: QuoteModel | null;
}>();

const rules = {
  text: {
    required: helpers.withMessage("Текст цитаты обязателен к заполнению", required),
  },
  extra: {
    required: helpers.withMessage("Автор цитаты обязателен к заполнению", required),
  },
};

const model = ref<QuoteModel>(props.modelValue ? props.modelValue : new QuoteModel());

const v$ = useVuelidate(rules, model);

const isInvalid = computed<boolean>(() => {
  return v$.value.text.$error || v$.value.extra.$error;
});

const checkErrors = (): void => {
  v$.value.text.$touch();
  v$.value.extra.$touch();
  emit("errorValueChange", isInvalid.value);
};

watch(
  () => model.value,
  async (newValue) => {
    emit("update:modelValue", newValue);
    emit("errorValueChange", isInvalid.value);
  },
  {
    deep: true,
  }
);

emitter.on(eventsConfig.formCheck, checkErrors);

onBeforeUnmount(() => {
  emitter.off(eventsConfig.formCheck, checkErrors);
});
</script>

<template>
  <div class="edit-content-quote">
    <BaseTextarea
      v-model="model.text"
      class="edit-content-quote__text"
      :custom-height="26"
      placeholder="Добавьте текст цитаты"
      :has-error="v$.text.$error"
      :error-message="v$.text.$errors[0]?.$message"
    />
    <BaseInput
      v-model="model.extra"
      class="edit-content-quote__extra"
      placeholder="Добавьте автора цитаты"
      :has-error="v$.extra.$error"
      :error-message="v$.extra.$errors[0]?.$message"
    />
  </div>
</template>

<style lang="scss">
.edit-content-quote {
  padding: 0 1.6rem;
  background: $gray-200;
  border-radius: $border-radius-sm;

  &__text {
    min-height: 6.6rem;

    .common-input__field {
      @include body-18;

      padding-right: 0;
      padding-left: 0;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid $gray-400;
      border-radius: 0;

      &::placeholder {
        @include body-18;
      }

      @media (max-width: $media-md) {
        @include body-16;

        &::placeholder {
          @include body-16;
        }
      }
    }
  }

  &__extra {
    .common-input__field {
      @include headline-18;

      height: 6.6rem;
      padding: 0;
      text-align: right;
      background-color: transparent;
      border: none;

      &::placeholder {
        @include headline-18;
      }

      @media (max-width: $media-md) {
        @include body-16;

        font-weight: normal;

        &::placeholder {
          @include body-16;

          font-weight: normal;
        }
      }
    }

    .common-input__error-msg {
      text-align: right;
    }
  }
}
</style>
