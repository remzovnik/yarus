<script lang="ts" setup>
import LinkModel from "@/modules/Posting/models/LinkModel";
import { onBeforeUnmount, ref, inject, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers, url, required } from "@vuelidate/validators";
import { eventsConfig } from "@/appConfig";

const emitter: any = inject("emitter");

const emit = defineEmits<{
  (event: "update:modelValue", modelValue: LinkModel): void;
  (event: "errorValueChange", value: boolean): void;
}>();

const rules = {
  link: {
    link: helpers.withMessage("Введите корректный адрес. Например, https://yarus.ru", url),
    required: helpers.withMessage("Адрес ссылки обязателен к заполнению", required),
  },
};

const props = defineProps<{
  modelValue: LinkModel | null;
}>();

const model = ref<LinkModel>(props.modelValue ? props.modelValue : new LinkModel());

const v$ = useVuelidate(rules, model);

const checkErrors = (): void => {
  v$.value.link.$touch();
  emit("errorValueChange", v$.value.link.$error);
};

watch(
  () => model.value,
  async (newValue) => {
    emit("update:modelValue", newValue);
    emit("errorValueChange", v$.value.link.$error);
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
  <div class="edit-content-link" :class="{ 'edit-content-link_error': v$.link.$error }">
    <div class="edit-content-link-url">
      <BaseIcon
        class="edit-content-link-url__icon"
        :class="{ 'edit-content-link-url__icon_error': v$.link.$error }"
        :size="20"
        name="link"
      />
      <BaseInput
        v-model="model.link"
        class="edit-content-link-url__value"
        placeholder="Добавьте ссылку"
        :has-error="v$.link.$error"
        :error-message="v$.link.$errors[0]?.$message as string"
      />
    </div>
    <BaseInput v-model="model.text" class="edit-content-link__text" placeholder="Добавьте текст ссылки" />
  </div>
</template>

<style lang="scss">
.edit-content-link {
  &_error {
    padding-bottom: 2rem;
  }

  .common-input__field {
    @include body-16;

    background-color: transparent;
    border: none;

    &::placeholder {
      @include body-16;
    }
  }

  &__text {
    position: relative;

    .common-input__field {
      height: 3rem;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
}

.edit-content-link-url {
  position: relative;
  display: flex;
  align-items: center;

  &__icon {
    margin-left: 1.6rem;

    &_error {
      color: $red-100;
    }
  }

  &__value {
    .common-input__field {
      height: 3rem;
      padding-top: 0;
      padding-bottom: 0;
      padding-left: 0.6rem;
    }

    .common-input__error-msg {
      position: absolute;
      bottom: -5rem;
      left: 0;
    }
  }
}
</style>
