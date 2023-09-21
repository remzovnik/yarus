import BaseRadioGroup from "@/modules/Main/components/base/BaseRadioGroup.vue";

export default {
  title: "Design System/BaseRadioGroup",
  component: BaseRadioGroup,
};

const Story = (args) => ({
  components: { BaseRadioGroup },

  setup() {
    return { args };
  },

  template: `<div style="width: 200px"><BaseRadioGroup v-bind="args"/></div>`,
});

export const RadioGroup = Story.bind({});

RadioGroup.args = {
  name: "gender",
  radios: [
    { value: "1", label: "Male" },
    { value: "2", label: "Female" },
  ],
  label: "Choose gender: ",
};

export const RadioGroupRequired = Story.bind({});

RadioGroupRequired.args = {
  name: "gender",
  radios: [
    { value: "1", label: "Male" },
    { value: "2", label: "Female" },
  ],
  label: "Choose gender: ",
  required: true,
};
