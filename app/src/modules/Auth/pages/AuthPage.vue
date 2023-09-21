<script lang="ts" setup>
import { Router, useRouter } from "vue-router";
import { computed, defineComponent, onMounted, ref } from "vue";
import AuthScreenEntry from "../components/AuthScreenEntry.vue";
import AuthScreenRegistration from "../components/AuthScreenRegistration.vue";
import AuthScreenRecovery from "../components/AuthScreenRecovery.vue";
import AuthScreenPassword from "@/modules/Auth/components/AuthScreenPassword.vue";
import { useAudioStore } from "@/modules/AudioPlayer/store/AudioPlayerStore";
import { appConfig } from "@/appConfig";
import { EAuthScreen } from "@/modules/Auth/const/EAuthScreen.enum";
import { useHead } from "@vueuse/head";
import AuthLayout from "@/modules/Auth/layouts/AuthLayout.vue";
import { EAuthFlow } from "@/modules/Auth/const/EAuthFlow.enum";

const audioPlayerStore = useAudioStore();

const router: Router = useRouter();
const currentScreen = ref<EAuthScreen>(EAuthScreen.PHONE);
const flow = ref<EAuthFlow>(EAuthFlow.BASE);

useHead({
  script: [
    {
      src: appConfig.captcha.url,
      async: true,
      defer: true,
    },
  ],
});

const authScreens: {
  [key in EAuthScreen]: ReturnType<typeof defineComponent>;
} = {
  [EAuthScreen.PHONE]: AuthScreenEntry,
  [EAuthScreen.REGISTRATION]: AuthScreenRegistration,
  [EAuthScreen.RECOVERY]: AuthScreenRecovery,
  [EAuthScreen.PASSWORD]: AuthScreenPassword,
};

const moveBack = (): void => {
  if (currentScreen.value === EAuthScreen.RECOVERY) {
    currentScreen.value = EAuthScreen.PASSWORD;
  } else if (currentScreen.value !== EAuthScreen.PHONE) {
    currentScreen.value = EAuthScreen.PHONE;
  } else {
    router.go(-1);
  }
};

const calcAuthScreen = computed<ReturnType<typeof defineComponent>>(() => {
  return authScreens[currentScreen.value];
});

onMounted(() => {
  audioPlayerStore.isActive = false;
  audioPlayerStore.isShown = false;
});
</script>

<template>
  <AuthLayout :current-screen="currentScreen" @move-back="moveBack">
    <component :is="calcAuthScreen" v-model:currentScreen="currentScreen" />
  </AuthLayout>
</template>
