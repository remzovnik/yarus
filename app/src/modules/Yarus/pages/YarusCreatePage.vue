<script lang="ts" setup>
import { ref } from "vue";
import { useYarusStore } from "@/modules/Yarus/stores/YarusStore";
import { onBeforeRouteLeave } from "vue-router";
import useModal from "@/modules/Main/components/modal/useModal";
import Seo from "@/modules/Seo/components/Seo.vue";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import YarusCreate from "@/modules/Yarus/components/YarusCreate.vue";
import { useRouter } from "vue-router";
import RouteModel from "@/modules/Main/models/RouteModel";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";

const router = useRouter();
const modal = useModal();
const yarusStore = useYarusStore();

const yarusCreate = ref<{ createYarus: () => number }>();

const isSaved = ref<boolean>(false);
const isCreateDisabled = ref<boolean>(true);

const createYarus = async (): Promise<void> => {
  if (yarusCreate.value) {
    const newYarusId = await yarusCreate.value.createYarus();

    if (newYarusId) {
      isSaved.value = true;
    }

    isSaved.value = true;
    const route: RouteModel = { name: ERouteName.YARUS_DETAIL, params: { id: newYarusId } };
    router.push(route);
  }
};

const changeCreateDisabledState = (newState: boolean) => {
  isCreateDisabled.value = newState;
};

onBeforeRouteLeave((to, from, next) => {
  if (isSaved.value) {
    yarusStore.reset();
    next();
  } else {
    const modalProps = {
      title: "Выйти из редактора?",
      description: "Ваши изменения не будут сохранены.",
      submitButtonText: "Выйти",
      submitHandler: (resolve, close) => {
        next();
        resolve();
        close();
        yarusStore.reset();
      },
    };

    modal.showConfirmModal(modalProps);
  }
});
</script>

<template>
  <Seo />
  <LayoutBase>
    <template #sidebar>
      <LayoutSidebar :type="ELayoutSidebarType.SIMPLE" />
    </template>
    <template #header>
      <div class="yarus-create-header hide-mobile">
        <BaseButton size="large" :is-disabled="isCreateDisabled" @click="createYarus">{{
          yarusStore.isEditing ? "Сохранить" : "Создать"
        }}</BaseButton>
      </div>
      <div class="only-mobile">
        <LayoutHeader />
      </div>
    </template>
    <template #content>
      <main class="yarus-create-page page">
        <h1 class="yarus-create-page__title page-title">{{ yarusStore.isEditing ? "Редактировать" : "Создать" }} ярус</h1>

        <YarusCreate ref="yarusCreate" class="yarus-create-page__main" @create-disabled="changeCreateDisabledState" />

        <BaseButton
          class="yarus-create-page__create-mobile only-mobile-flex"
          :is-disabled="isCreateDisabled"
          @click="createYarus"
          >{{ yarusStore.isEditing ? "Сохранить" : "Создать" }}</BaseButton
        >
      </main>
    </template>
  </LayoutBase>
</template>

<style lang="scss">
.yarus-create-page {
  &__title {
    margin-bottom: 4rem;
  }

  &__main {
    width: 55rem;

    @media (max-width: $media-sm) {
      width: 100%;
    }
  }
}

.yarus-create-header {
  display: flex;
  justify-content: flex-end;
  padding: 3.2rem 0;

  @media (max-width: $media-sm) {
    display: none;
  }
}
</style>
