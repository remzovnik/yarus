import { defineAsyncComponent } from "vue";

const BaseAvatar = defineAsyncComponent(() => import("@/modules/Base/components/BaseAvatar.vue"));
import BaseButton from "@/modules/Base/components/BaseButton.vue";
const BaseCheckbox = defineAsyncComponent(() => import("@/modules/Base/components/BaseCheckbox.vue"));
import BaseChips from "@/modules/Base/components/BaseChips.vue";
import BaseIcon from "@/modules/Base/components/BaseIcon.vue";
const BaseInfiniteScroll = defineAsyncComponent(() => import("@/modules/Base/components/BaseInfiniteScroll.vue"));
import BaseInput from "@/modules/Base/components/BaseInput/BaseInput.vue";
const BaseInputCode = defineAsyncComponent(() => import("@/modules/Base/components/BaseInputCode.vue"));
const BaseQuote = defineAsyncComponent(() => import("@/modules/Base/components/BaseQuote.vue"));
const BaseLink = defineAsyncComponent(() => import("@/modules/Base/components/BaseLink.vue"));
const BaseRadio = defineAsyncComponent(() => import("@/modules/Base/components/BaseRadio.vue"));
const BaseRadioGroup = defineAsyncComponent(() => import("@/modules/Base/components/BaseRadioGroup.vue"));
const BaseReaction = defineAsyncComponent(() => import("@/modules/Base/components/BaseReaction.vue"));
const BaseSelect = defineAsyncComponent(() => import("@/modules/Base/components/BaseSelect.vue"));
const BaseSlider = defineAsyncComponent(() => import("@/modules/Base/components/BaseSlider.vue"));
const BaseSpinner = defineAsyncComponent(() => import("@/modules/Base/components/BaseSpinner.vue"));
const BaseSwitcher = defineAsyncComponent(() => import("@/modules/Base/components/BaseSwitcher.vue"));
const BaseTabs = defineAsyncComponent(() => import("@/modules/Base/components/BaseTabs.vue"));
const BaseTag = defineAsyncComponent(() => import("@/modules/Base/components/BaseTag.vue"));
import BaseTextarea from "@/modules/Base/components/BaseTextarea.vue";
const BaseModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/BaseModal.vue"));
const LayoutBase = defineAsyncComponent(() => import("@/modules/Main/components/layouts/LayoutBase.vue"));
const LayoutHeader = defineAsyncComponent(() => import("@/modules/Main/components/layouts/LayoutHeader.vue"));
const LayoutSidebar = defineAsyncComponent(() => import("@/modules/Main/components/layouts/LayoutSidebar.vue"));
const LayoutList = defineAsyncComponent(() => import("@/modules/Main/components/layouts/LayoutList.vue"));
const BaseGrid = defineAsyncComponent(() => import("@/modules/Base/components/BaseGrid/BaseGrid.vue"));

export default {
  BaseAvatar,
  BaseButton,
  BaseCheckbox,
  BaseChips,
  BaseIcon,
  BaseInfiniteScroll,
  BaseInput,
  BaseInputCode,
  BaseQuote,
  BaseLink,
  BaseRadio,
  BaseRadioGroup,
  BaseReaction,
  BaseSelect,
  BaseSlider,
  BaseSpinner,
  BaseSwitcher,
  BaseTabs,
  BaseTag,
  BaseTextarea,
  BaseModal,
  LayoutBase,
  LayoutSidebar,
  LayoutHeader,
  LayoutList,
  BaseGrid,
};
