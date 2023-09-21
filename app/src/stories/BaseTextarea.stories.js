import BaseTextarea from "@/modules/Main/components/base/BaseTextarea.vue";

export default {
  title: "Design System/BaseTextarea",
  component: BaseTextarea,

  argTypes: {
    size: {
      options: ["large", "medium"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { BaseTextarea },

  setup() {
    return { args };
  },

  template: `<BaseTextarea v-bind="args"/>`,
});

export const Large = Story.bind({});

Large.args = {
  size: "large",
  placeholder: "Placeholder",
};

export const Medium = Story.bind({});

Medium.args = {
  size: "medium",
  placeholder: "Placeholder",
};

export const CustomHeight = Story.bind({});

CustomHeight.args = {
  customHeight: 160,
  placeholder: "Placeholder",
};

export const WithPlaceholder = Story.bind({});

WithPlaceholder.args = {
  placeholder: "Placeholder",
};

export const WithMaxLength = Story.bind({});

WithMaxLength.args = {
  placeholder: "Placeholder",
  maxLength: 255,
};

export const Required = Story.bind({});

Required.args = {
  placeholder: "Placeholder",
  required: true,
};

export const HasError = Story.bind({});

HasError.args = {
  placeholder: "Placeholder",
  required: true,
  errorMessage: "Error message",
  hasError: true,
};
