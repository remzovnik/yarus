<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import SearchInput from "@/modules/Main/components/form/SearchInput.vue";
import useModal from "@/modules/Main/components/modal/useModal";
import AuthApiService from "@/modules/Auth/apiService/AuthApiService";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import { useRoute, useRouter } from "vue-router";
import { ESearchContentType } from "@/modules/Search/models/ESearchContentType.enum";
import { useAuthStore } from "@/modules/Auth/stores/AuthStore";
import RouteModel from "@/modules/Main/models/RouteModel";
import { useBreakpoints } from "@vueuse/core";
import { eventsConfig } from "@/appConfig";
import useDisableScroll from "@/modules/Main/composables/useDisableScroll";
import { ELayoutSidebarType } from "@/modules/Main/components/layouts/ELayoutSidebarType.enum";
import { ERouteName } from "@/infrastructure/Routing/RouteName.enum";
import Logo from "@/modules/Logo/components/Logo.vue";
import { appConfig } from "@/appConfig";

const authStore = useAuthStore();

const modal = useModal();
const router = useRouter();
const route = useRoute();
const emitter: any = inject("emitter");

defineProps<{ type?: ELayoutSidebarType }>();

const isSearchInputActive = ref(false);
const isSearchInputFocused = ref(false);
const queryString = ref("");
const searchShown = ref(false);
const menuShown = ref(false);
const breakpoints = useBreakpoints({ mobile: 767 });
const isMobile = breakpoints.smaller("mobile");

const MENU_ANIMATION_TIME = 300;

useDisableScroll(menuShown, MENU_ANIMATION_TIME);

const focusHandler = (): void => {
  isSearchInputFocused.value = true;
};

const blurHandler = (): void => {
  isSearchInputActive.value = false;
  isSearchInputFocused.value = false;
};

const changeHandler = (): void => {
  isSearchInputActive.value = true;
};

const enterHandler = (newValue: string): void => {
  queryString.value = newValue;
  if (queryString.value) {
    isSearchInputActive.value = false;
    isSearchInputFocused.value = false;
    router.push({
      name: route.name?.toString().includes("search") ? route.name : `search-${ESearchContentType.USER}`,
      query: { text: queryString.value },
    });
  }
};

const clearHandler = (): void => {
  isSearchInputActive.value = false;
};

const toggleSearch = (): void => {
  searchShown.value = !searchShown.value;
  menuShown.value = false;
};

const toggleMobileMenu = (): void => {
  menuShown.value = !menuShown.value;
  searchShown.value = false;
};

const hideMobileMenu = (): void => {
  setTimeout(() => {
    menuShown.value = false;
  }, 200);
};

const yarusClickHandler = async (): Promise<void> => {
  if (!authStore.checkAuth()) {
    await modal.showRequiresAuthModal();
    return;
  }

  const route: RouteModel = { name: ERouteName.YARUS };
  await router.push(route);
};

const profileBtnClickHandler = (): void => {
  const routeProfile: RouteModel = { name: ERouteName.USER, params: { id: authStore.sessionUser?.id } };
  const routeAuth: RouteModel = { name: ERouteName.AUTH };

  router.push(authStore.checkAuth() ? routeProfile : routeAuth);
};

const settingsBtnClickHandler = (): void => {
  const routeSettings: RouteModel = { name: ERouteName.SETTINGS };
  router.push(routeSettings);
};

const logoutBtnClickHandler = async (): Promise<void> => {
  const route: RouteModel = { name: ERouteName.HOME };
  await ServiceLocator.instance.getService(AuthApiService).logout();
  emitter.emit(eventsConfig.authLogout);
  await router.push(route);
};

const statisticBtnClickHandler = async (): Promise<void> => {
  const route: RouteModel = { name: ERouteName.HOME };
  await ServiceLocator.instance.getService(AuthApiService).logout();
  emitter.emit(eventsConfig.authLogout);
  await router.push(route);
};

const showCreateContentModal = () => {
  if (!authStore.checkAuth()) {
    modal.showRequiresAuthModal();
    return;
  }
  modal.showCreateContentModal();
};

const searchOverlayClasses = computed<object>(() => {
  return {
    "header-layout__search-overlay_active": isSearchInputActive.value,
    "header-layout__search-overlay_focused": isSearchInputFocused.value,
  };
});

watch(
  () => route.query,
  () => {
    queryString.value = route.query?.text ? `${route.query.text}` : "";
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <div class="header-layout">
    <SearchInput
      v-model="queryString"
      placeholder="Поиск"
      class="header-layout__search"
      @focus="focusHandler"
      @blur="blurHandler"
      @change="changeHandler"
      @clear="clearHandler"
      @enter="enterHandler"
    />
    <div class="header-layout__search-overlay" :class="searchOverlayClasses"></div>

    <div v-if="authStore.isAuthorized" class="header-layout__profile-btn">
      <VDropdown :skidding="-44">
        <button class="header-layout__profile-btn-trigger">
          <BaseAvatar :image="authStore.photo" :size="44" />
        </button>
        <template #popper="{ hide }">
          <div class="header-layout__dropdown-menu" @click="hide()">
            <BaseButton icon="personal" type="list-item" size="large" @click="profileBtnClickHandler"> Профиль</BaseButton>
            <a class="header-layout__dropdown-menu-item" :href="appConfig.yarusStatistics.url" target="_blank">
              <BaseIcon class="header-layout__dropdown-menu-item-icon" name="statistics" />
              <span>Кабинет статистики</span>
            </a>
            <BaseButton icon="settings" type="list-item" size="large" @click="settingsBtnClickHandler"> Настройки</BaseButton>
            <BaseButton icon="logout" type="list-item" size="large" @click="logoutBtnClickHandler"> Выход</BaseButton>
          </div>
        </template>
      </VDropdown>
    </div>
    <BaseButton
      v-else
      class="header-layout__profile-btn"
      type="secondary"
      icon="profile"
      size="large"
      aria-label="Личный кабинет"
      @click="profileBtnClickHandler"
    />

    <BaseButton
      class="header-layout__yarus-btn"
      type="secondary"
      icon="stripes"
      size="large"
      aria-label="Мои ярусы"
      title="Персональные ярусы"
      @click="yarusClickHandler"
    />
    <BaseButton
      class="header-layout__create-btn"
      icon="plus"
      size="large"
      aria-label="Создать контент"
      @click="showCreateContentModal"
      >Создать
    </BaseButton>
  </div>

  <div class="header-layout__mobile-bar">
    <div class="header-layout__mobile-bar-wrapper">
      <BaseButton
        class="header-layout__burger-btn"
        type="transparent"
        :icon="menuShown ? 'close' : 'menu'"
        size="large"
        aria-label="Переключить меню"
        @click="toggleMobileMenu"
      />

      <Logo is-tablet-small />

      <BaseButton class="header-layout__search-btn" type="secondary" icon="search" @click="toggleSearch" />
      <BaseButton
        class="header-layout__mobile-create-btn"
        type="secondary"
        icon="plus"
        aria-label="Создать контент"
        @click="showCreateContentModal"
      />
    </div>

    <Transition>
      <div class="header-layout__mobile-search">
        <SearchInput
          v-if="searchShown && isMobile"
          v-model="queryString"
          size="medium"
          placeholder="Поиск"
          @focus="focusHandler"
          @blur="blurHandler"
          @change="changeHandler"
          @clear="clearHandler"
          @enter="enterHandler"
        />
      </div>
    </Transition>
    <div v-if="searchShown && isMobile" class="header-layout__search-overlay" :class="searchOverlayClasses"></div>
  </div>

  <Transition>
    <LayoutSidebar v-if="menuShown" :type="type" class="header-layout__navbar" @nav-click="hideMobileMenu" />
  </Transition>
</template>

<style lang="scss">
.header-layout {
  position: sticky;
  top: 0;
  z-index: 101;
  display: flex;
  align-items: center;
  height: $header-height;
  margin-left: -1px;
  background: $white-100;

  @media (max-width: $media-sm) {
    display: none;
  }

  &__search {
    flex-grow: 1;
  }

  &__search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: none;
    width: 100%;
    height: 100%;
    transition: background-color $trs-back;

    &_focused {
      display: block;
      background-color: $gray-800-20;
      transition: background-color $trs-forward;
    }

    &_active {
      background-color: $gray-800-60;
      transition: background-color $trs-forward;
    }
  }

  &__profile-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.8rem;
    height: 4.8rem;
    margin-left: 2.4rem;
  }

  &__dropdown-menu {
    position: relative;
    padding: 0.8rem;
    overflow: hidden;
    background: $white-100;
    border-radius: $border-radius-sm;
    box-shadow: $box-shadow-deep;
  }

  &__dropdown-menu-item {
    @include label-16;

    display: flex;
    padding: 1.3rem 1rem;
    border-radius: $border-radius-sm;

    &:hover {
      background-color: $gray-300;
    }
  }

  &__dropdown-menu-item-icon {
    margin-right: 0.8rem;
  }

  &__yarus-btn {
    margin-left: 1.6rem;
  }

  &__create-btn {
    margin-left: 2.4rem;
  }

  &__save-btn {
    margin-left: auto;
  }

  &__login-btn {
    margin-left: 3.2rem;
  }

  &__sign-up-btn {
    margin-left: 3.2rem;
  }

  &__mobile-bar {
    display: none;

    @media (max-width: $media-sm) {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 100;
      display: block;
    }

    &-wrapper {
      display: none;
      align-items: center;
      margin: 0 -1.6rem;
      padding: 0.8rem 1.6rem;
      background-color: $gray-100;

      @media (max-width: $media-sm) {
        display: flex;
      }
    }
  }

  &__burger-btn {
    color: $gray-900;
  }

  &__search-btn {
    margin-left: auto;
  }

  &__mobile-create-btn {
    margin-left: 0.8rem;
  }

  &__mobile-search {
    margin: 0 -1.6rem;
    padding: 0.8rem 1.6rem;
    background-color: $white-100;
  }

  &__navbar {
    position: fixed;
    top: 5.6rem;
    left: 0;
    z-index: 101;
    display: none;

    @media (max-width: $media-sm) {
      display: flex;
    }

    &.v-enter-active,
    &.v-leave-active {
      transform: translateX(0);
      transition: transform $trs-forward;
    }

    &.v-enter-from,
    &.v-leave-to {
      transform: translateX(-100%);
    }
  }
}
</style>
