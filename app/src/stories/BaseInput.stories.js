import BaseInput from "@/Base/components/BaseInput/BaseInput.vue";
import { phoneMask } from "@/_core/utils/InputMaskDefinitions";

export default {
  title: "Design System/BaseInput",
  component: BaseInput,

  argTypes: {
    size: {
      options: ["large", "medium"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { BaseInput },

  setup() {
    return { args };
  },

  template: `<BaseInput v-bind="args"/>`,
});

export const Large = Story.bind({});

Large.args = {
  size: "large",
  placeholder: "Введите текст",
};

export const Medium = Story.bind({});

Medium.args = {
  size: "medium",
  placeholder: "Введите текст",
};

export const Masked = Story.bind({});

Masked.args = {
  size: "large",
  placeholder: "Введите текст",
  mask: phoneMask,
};

export const WithОписание = Story.bind({});

WithОписание.args = {
  size: "large",
  placeholder: "Введите текст",
  label: "Описание",
};

export const Disabled = Story.bind({});

Disabled.args = {
  size: "large",
  placeholder: "Введите текст",
  isDisabled: true,
};

export const HasError = Story.bind({});

HasError.args = {
  size: "large",
  placeholder: "Введите текст",
  errorMessage: "Ошибка",
  label: "Текст",
  hasError: true,
};
