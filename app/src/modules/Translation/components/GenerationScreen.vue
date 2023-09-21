<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import BaseButton from "@/modules/Base/components/BaseButton.vue";
import TranslationApiService from "@/modules/Translation/TranslationApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import BaseInput from "@/modules/Base/components/BaseInput/BaseInput.vue";
import { ITranslationGenerationData } from "@/modules/Translation/infrastructure/api/ITranslationGenerationData";
import useNotify from "@/modules/Main/components/toast/useNotify";
import { EBaseInputType } from "@/modules/Base/components/BaseInput/EBaseInputType";
import copyStringToClipboard from "@/_core/utils/CopyStringToClipboard";

const emit = defineEmits<{ (e: "onGenerated", payload: ITranslationGenerationData): void }>();
const isFullscreen = ref(false);
const isLoading = ref(false);
const notify = useNotify();
const generatedData = ref<ITranslationGenerationData | null>(null);
const generate = async (): Promise<void> => {
  isLoading.value = true;
  let checkStatusResult = false;
  generatedData.value = await ServiceLocator.instance.getService(TranslationApiService).createTranslation();
  if (generatedData.value) {
    checkStatusResult = await ServiceLocator.instance
      .getService(TranslationApiService)
      .checkStatus(generatedData.value.streamResourceId);
    if (!checkStatusResult) {
      notify.message(true, "false", "Ошибка!");
    }
  }
  isLoading.value = false;
};
const toggleFullscreen = (): void => {
  isFullscreen.value = !isFullscreen.value;
};

const nextStep = (): void => {
  if (generatedData.value) {
    emit("onGenerated", generatedData.value);
  }
};

const stepText = computed<string>(() => {
  return isLoading.value ? "Идет генерация. Она может занять до 10 мин." : "Шаг 1 из 2";
});

const copyToClipboard = async (value: string) => {
  try {
    await copyStringToClipboard(value);
    notify.message(true, "true", "Ссылка успешно скопирована");
  } catch {
    notify.message(true, "true", "Ошибка копирования");
  }
};
</script>

<template>
  <div class="translation-generation-screen">
    <fullscreen v-model="isFullscreen" :teleport="false" :page-only="false">
      <img
        class="instruction-cover"
        src="/images/stream/instruction.png"
        alt="Инструкция к созданию трансляции"
        width="1488"
        height="826"
        @click="toggleFullscreen"
      />
    </fullscreen>
    <div class="instruction-text">
      Инструкция на примере OBS Studio. Для начала вещания скопируйте сгенерированные URL сервера и Key. После этого добавьте их в
      программе OBS Studio. Для этого откройте вкладку “Файл”, затем “Настройки”, “Трансляция”, “Выбрать сервис”.
    </div>
    <div v-if="generatedData && !isLoading">
      <div class="translation-generation-screen__label">URL сервера</div>
      <BaseInput
        v-model="generatedData.streamPublishUrl"
        class="translation-generation-screen__input"
        :type="EBaseInputType.SHARE"
        readonly
        @click="copyToClipboard(generatedData?.streamPublishUrl || '')"
      />
      <div class="translation-generation-screen__label">Key</div>
      <BaseInput
        v-model="generatedData.streamKey"
        :type="EBaseInputType.SHARE"
        readonly
        class="translation-generation-screen__input"
        @click="copyToClipboard(generatedData?.streamKey || '')"
      />
    </div>
    <div class="translation-loading-page__footer">
      <div></div>
      <div class="translation-loading-page__state">
        <div class="translation-loading-page__step">{{ stepText }}</div>
        <BaseButton v-if="isLoading" is-only-icon is-loading />
        <BaseButton v-else-if="generatedData" type="primary" @click="nextStep">Продолжить</BaseButton>
        <BaseButton v-else type="primary" @click="generate">Сгенерировать URL и Key</BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.instruction-cover {
  width: 100%;
  height: 41.3rem;
  margin-bottom: 2.4rem;
  border-radius: $border-radius-md;
  cursor: pointer;
}

.instruction-text {
  @include body-18;

  margin-bottom: 2.4rem;
  color: $gray-800;
}

.fullscreen {
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(40 40 40);

  .instruction-cover {
    width: auto;
    height: auto;
  }
}

.translation-generation-screen {
  &__label {
    @include headline-16;

    margin-bottom: 1.2rem;
  }

  &__input {
    margin-bottom: 2.4rem;
  }

  .common-input__field {
    color: $blue-100;
  }
}
</style>
