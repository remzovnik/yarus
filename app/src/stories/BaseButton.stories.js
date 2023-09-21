import BaseButton from "@/modules/Main/components/base/BaseButton.vue";

export default {
  title: "Design System/BaseButton",
  component: BaseButton,

  argTypes: {
    type: {
      options: ["primary", "secondary", "transparent"],
      control: { type: "radio" },
    },

    size: {
      options: ["large", "medium", "small"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { BaseButton },

  setup() {
    return { args };
  },

  template: `<BaseButton v-bind="args">${args.slot}</BaseButton>`,
});

export const Large = Story.bind({});

Large.args = {
  slot: "Кнопка",
  type: "primary",
  size: "large",
};

export const Medium = Story.bind({});

Medium.args = {
  slot: "Кнопка",
  type: "primary",
  size: "medium",
};

export const Small = Story.bind({});

Small.args = {
  slot: "Кнопка",
  type: "primary",
  size: "small",
};

export const LargeOnlyIcon = Story.bind({});

LargeOnlyIcon.args = {
  slot: "",
  type: "primary",
  size: "large",
  icon: "plus",
};

export const MediumOnlyIcon = Story.bind({});

MediumOnlyIcon.args = {
  slot: "",
  type: "primary",
  size: "medium",
  icon: "plus",
};

export const MediumTextIcon = Story.bind({});

MediumTextIcon.args = {
  slot: "Кнопка",
  type: "primary",
  size: "large",
  icon: "plus",
};

export const Loading = Story.bind({});

Loading.args = {
  slot: "Кнопка",
  type: "primary",
  size: "large",
  isLoading: true,
};
