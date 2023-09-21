import Datepicker from "@/modules/Main/components/datepicker/Datepicker.vue";
import BaseButton from "@/modules/Main/components/base/BaseButton.vue";

export default {
  title: "Design System/Datepicker",
  component: Datepicker,

  argTypes: {
    isFuture: {
      options: [true, false],
      control: { type: "radio" },
    },
    isRange: {
      options: [true, false],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { Datepicker, BaseButton },

  setup() {
    return { args };
  },

  template: `<div><Datepicker v-bind="args">
              <template #trigger>
                <BaseButton type="secondary" size="large">Выберите дату</BaseButton>
              </template>
            </Datepicker></div>`,
});

export const Default = Story.bind({});

Default.args = {
  isFuture: false,
  isRange: false,
};
