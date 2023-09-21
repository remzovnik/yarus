import ButtonTechnical from "@/modules/Main/components/buttons/ButtonTechnical.vue";

export default {
  title: "Design System/ButtonTechnical",
  component: ButtonTechnical,
};

const Story = (args) => ({
  components: { ButtonTechnical },

  setup() {
    return { args };
  },

  template: `<ButtonTechnical v-bind="args"/>`,
});

export const WithIcon = Story.bind({});

WithIcon.args = {
  caption: "123700",
  icon: "like",
};

export const OnlyIcon = Story.bind({});

OnlyIcon.args = {
  icon: "like",
};
