<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { ResponseType } from "@/modules/Main/models/ResponseModel";
import FeedbackModel from "@/modules/Main/models/FeedbackModel";
import useVuelidate from "@vuelidate/core";
import { phoneMask } from "@/_core/utils/InputMaskDefinitions";
import { FeedbackValidationRules } from "@/modules/Main/utils/FeedbackValidationRules";
import FeedbackService from "@/modules/Main/apiServices/FeedbackService";

const notify = useNotify();

const feedbackData = reactive(new FeedbackModel());
const isLoading = ref(false);
const v$ = useVuelidate(FeedbackValidationRules(), feedbackData);

const submitHandler = async (resolve, close): Promise<void> => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  isLoading.value = true;
  const response = await ServiceLocator.instance.getService(FeedbackService).sendFeedback(feedbackData);
  if (response.status === ResponseType.OK) {
    notify.message(true, "true", "Сообщение успешно отправлено");
  } else {
    notify.message(true, "false", "Произошла ошибка");
  }
  isLoading.value = false;
  resolve();
  close();
};
</script>

<template>
  <BaseModal
    title="Напишите нам"
    submit-button-text="Отправить"
    :are-actions-shown="true"
    :is-submit-disabled="v$.$invalid"
    :is-loading="isLoading"
    :submit-handler="submitHandler"
  >
    <template #content>
      <div class="feedback-modal">
        <BaseInput
          v-model="feedbackData.name"
          label="Имя"
          required
          :maxlength="255"
          :has-error="v$.name.$error"
          :error-message="(v$.name.$errors[0]?.$message as string)"
          @blur="v$.name.$touch()"
        />

        <BaseInput
          v-model="feedbackData.phone"
          label="Телефон"
          type="phone"
          :mask="phoneMask"
          :has-error="v$.phone.$error"
          :error-message="(v$.phone.$errors[0]?.$message as string)"
          @blur="v$.phone.$touch()"
        />

        <BaseInput
          v-model="feedbackData.email"
          label="E-mail"
          required
          :has-error="v$.email.$error"
          :error-message="(v$.email.$errors[0]?.$message as string)"
          @blur="v$.email.$touch()"
        />

        <BaseTextarea
          v-model="feedbackData.text"
          :custom-height="160"
          placeholder="Текст сообщения"
          required
          :has-error="v$.text.$error"
          :error-message="(v$.text.$errors[0]?.$message as string)"
          @blur="v$.text.$touch()"
        />
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss">
.feedback-modal {
  & > *:not(:last-child) {
    margin-bottom: 0.8rem;
  }
}
</style>
