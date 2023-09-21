import { renderComponent } from "@/_core/utils/ComponentUtils";
import SnackbarContainer from "@/modules/Main/components/toast/SnackbarContainer.vue";
import { ComponentInternalInstance } from "vue";

let SnackbarContainerInstance: ComponentInternalInstance | null = null;

export default function useNotify() {
  const getOrCreateContainer = () => {
    if (!SnackbarContainerInstance) {
      const res = renderComponent(SnackbarContainer, {});
      SnackbarContainerInstance = res.vNode.component;
    }
    return SnackbarContainerInstance;
  };

  const show = (withStatus: boolean, statusType: string, text: string) => {
    const container = getOrCreateContainer();
    if (!!container) {
      container.props.notify = { withStatus, statusType, text, id: Date.now() * Math.random() };
    }
  };

  const message = (withStatus: boolean, statusType: string, text: string) => {
    show(withStatus, statusType, text);
  };

  return {
    message,
  };
}
