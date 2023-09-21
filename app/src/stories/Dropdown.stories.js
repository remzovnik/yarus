import { Dropdown as VDropdown } from "floating-vue";
import BaseButton from "@/modules/Main/components/base/BaseButton.vue";

export default {
  title: "Design System/Dropdown",
};

const Story = (args) => ({
  components: { VDropdown, BaseButton },

  setup() {
    return { args };
  },

  template: `<div>
  <VDropdown placement="bottom-start" :skidding="60">
    <BaseButton type="secondary" size="large" icon="dots-vertical" />
    <template #popper>
      <div :style="{ padding: '1rem' }">
        контент дропдауна
      </div>
    </template>
  </VDropdown>
  </div>`,
});

export const Default = Story.bind({});
