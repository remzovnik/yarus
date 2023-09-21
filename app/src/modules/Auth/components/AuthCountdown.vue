<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  milliseconds: number;
}>();

const emit = defineEmits(["expired"]);

const timer = ref<ReturnType<typeof setInterval> | undefined>(undefined);
const timeString = ref("");

const updateTimer = (): void => {
  const now = new Date().getTime();
  const diff = countDownDate.value - now;

  getTimeString(diff);

  if (diff < 1000) {
    resetTimer();
    emit("expired");
  }
};

const resetTimer = (): void => {
  if (timer.value !== undefined) {
    clearInterval(timer.value);
  }

  timer.value = undefined;
};

const getTimeString = (milliseconds: number): void => {
  const formatHours = formatTime(getHours(milliseconds));
  const formatMinutes = formatTime(getMinutes(milliseconds));
  const formatSeconds = formatTime(getSeconds(milliseconds));

  timeString.value = `${formatHours}:${formatMinutes}:${formatSeconds}`;
};
const getHours = (milliseconds: number): number => {
  return Math.floor((milliseconds % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60));
};
const getMinutes = (milliseconds: number): number => {
  return Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
};

const getSeconds = (milliseconds: number): number => {
  return Math.floor((milliseconds % (1000 * 60)) / 1000);
};

const formatTime = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`;
};

const countDownDate = computed<number>(() => {
  return new Date().getTime() + props.milliseconds;
});

onMounted(() => {
  updateTimer();
  timer.value = setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
  resetTimer();
});
</script>

<template>
  <div class="auth-countdown">{{ timeString }}</div>
</template>
