import BaseRadio from "@/modules/Main/components/base/BaseRadio.vue";

export default {
  title: "Design System/BaseRadio",
  component: BaseRadio,
};

const Story = (args) => ({
  components: { BaseRadio },

  setup() {
    return { args };
  },

  template: `<BaseRadio v-bind="args"/>`,
});

export const Radio = Story.bind({});

Radio.args = {
  name: "gender",
  id: "1",
  value: "1",
  label: "Male",
};
