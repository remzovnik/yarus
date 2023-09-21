import BaseCheckbox from "@/modules/Main/components/base/BaseCheckbox.vue";

export default {
  title: "Design System/BaseCheckbox",
  component: BaseCheckbox,
};

const Story = (args) => ({
  components: { BaseCheckbox },

  setup() {
    return { args };
  },

  template: `<BaseCheckbox v-bind="args">${args.slot}</BaseCheckbox>`,
});

export const Default = Story.bind({});

Default.args = {
  slot: "Текст описания",
};
