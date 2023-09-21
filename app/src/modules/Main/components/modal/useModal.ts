import { IdBigInt } from "@/_core/Base.type";
import { EActionContentType } from "@/modules/Main/models/EActionContentType";
import { AppContext, Component, createVNode, getCurrentInstance, render, VNode, defineAsyncComponent, Ref } from "vue";
import PeekFeedModalPropsModel from "@/modules/Main/models/PeekFeedModalPropsModel";

const AvailableSoonModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/UnavailableModal.vue"));
const ConfirmModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/ConfirmModal.vue"));
const ComplaintModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/ComplaintModal.vue"));
const RequiresAuthModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/RequiresAuthModal.vue"));
const ReactionListModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/ReactionListModal.vue"));
const FeedbackModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/FeedbackModal.vue"));
const CreateContentModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/CreateContentModal.vue"));
const PickFeedModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/PickFeedModal.vue"));
const RatingModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/RatingModal.vue"));
const ShareModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/ShareModal.vue"));
const SeanceModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/SeanceModal.vue"));
const FeedModal = defineAsyncComponent(() => import("@/modules/Feed/components/FeedModal.vue"));
const CopyCodeModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/CopyCodeModal.vue"));
const InfoModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/InfoModal.vue"));
const UserStatsModal = defineAsyncComponent(() => import("@/modules/Main/components/modal/UserStatsModal.vue"));
const MainFeedFilterModal = defineAsyncComponent(() => import("@/modules/MainFeed/components/MainFeedFilterModal.vue"));

const renderComponent = (
  appContext: AppContext | null | undefined,
  component: Component,
  { props, children, element }: { props?: any; children?: unknown; element?: HTMLElement }
) => {
  const el: HTMLElement | null = element || document.createElement("div");
  const vNode: VNode | null = createVNode(component, props, children);

  const context = appContext || getCurrentInstance()?.appContext;

  if (!!context) {
    vNode.appContext = { ...context };
  }

  render(vNode, el);
};

export default function useModal() {
  const appInst = getCurrentInstance()?.appContext;

  const show = async <T>(component: Component, props?: any): Promise<T> => {
    return new Promise((resolve) => {
      const compProps = { ...props, isShown: true, resolve };
      renderComponent(appInst, component, { props: compProps });
    });
  };

  const showAvailableSoonModal = (props?): Promise<void> => {
    return show(AvailableSoonModal, props);
  };

  const showConfirmModal = (props): Promise<void> => {
    return show(ConfirmModal, props);
  };

  const showComplaintModal = (
    id: number | string | IdBigInt,
    contentType: EActionContentType,
    contentId?: number | string,
    parentId?: number | IdBigInt | null
  ): Promise<void> => {
    return show(ComplaintModal, { id, contentType, contentId, parentId });
  };

  const showCreateContentModal = (props?): Promise<void> => {
    return show(CreateContentModal, props);
  };

  const showPickFeedModal = (props: PeekFeedModalPropsModel): Promise<number> => {
    return show(PickFeedModal, props);
  };

  const showRequiresAuthModal = (): Promise<void> => {
    return show(RequiresAuthModal);
  };

  const showEmotionListModal = (props): Promise<void> => {
    return show(ReactionListModal, props);
  };

  const showFeedbackModal = (): Promise<void> => {
    return show(FeedbackModal);
  };

  const showShareModal = (props): Promise<void> => {
    return show(ShareModal, props);
  };

  const showRatingModal = (props): Promise<void> => {
    return show(RatingModal, props);
  };

  const showSeanceModal = (props): Promise<void> => {
    return show(SeanceModal, props);
  };

  const showFeedModal = (id?: number) => {
    return show(FeedModal, { id });
  };

  const showCopyCodeModal = (id: number) => {
    return show(CopyCodeModal, { id });
  };

  const showInfoModal = (props): Promise<void> => {
    return show(InfoModal, props);
  };

  const showUserStatsModal = (props): Promise<void> => {
    return show(UserStatsModal, props);
  };

  const showMainFeedFilterModal = (props): Promise<void> => {
    return show(MainFeedFilterModal, props);
  };

  return {
    show,
    showAvailableSoonModal,
    showComplaintModal,
    showConfirmModal,
    showCreateContentModal,
    showPickFeedModal,
    showRequiresAuthModal,
    showEmotionListModal,
    showFeedbackModal,
    showShareModal,
    showRatingModal,
    showSeanceModal,
    showFeedModal,
    showCopyCodeModal,
    showInfoModal,
    showUserStatsModal,
    showMainFeedFilterModal,
  };
}
