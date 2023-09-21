import BaseTag from "@/modules/Main/components/base/BaseTag.vue";

export default {
  title: "Design System/BaseTag",
  component: BaseTag,

  argTypes: {
    theme: {
      options: ["default", "dark"],
      control: { type: "radio" },
    },

    size: {
      options: ["large", "medium"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { BaseTag },

  setup() {
    return { args };
  },

  template: `<div style="width: 100px"><BaseTag v-bind="args">${args.slot}</BaseTag></div>`,
});

export const Default = Story.bind({});

Default.args = {
  slot: "Название",
};

export const Dark = Story.bind({});

Dark.args = {
  slot: "Название",
  theme: "dark",
};

export const Removable = Story.bind({});

Removable.args = {
  slot: "Название",
  isRemovable: true,
};
