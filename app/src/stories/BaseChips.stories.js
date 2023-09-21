import BaseChips from "@/modules/Main/components/base/BaseChips.vue";

export default {
  title: "Design System/BaseChips",
  component: BaseChips,

  argTypes: {
    type: {
      options: ["choice", "choice-icon", "filter", "filter-icon"],
      control: { type: "radio" },
    },

    size: {
      options: ["large", "medium", "small"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { BaseChips },

  setup() {
    return { args };
  },

  template: `<BaseChips v-bind="args">${args.slot}</BaseChips>`,
});

export const Choice = Story.bind({});

Choice.args = {
  slot: "Название",
  type: "choice",
};

export const ChoiceArrow = Story.bind({});

ChoiceArrow.args = {
  slot: "Название",
  type: "choice-icon",
};

export const Filter = Story.bind({});

Filter.args = {
  slot: "Название",
  type: "filter",
};

export const FilterArrow = Story.bind({});

FilterArrow.args = {
  slot: "Название",
  type: "filter-icon",
};

export const FilterIcon = Story.bind({});

FilterIcon.args = {
  slot: "Название",
  icon: "yarus",
  type: "filter-icon",
};
