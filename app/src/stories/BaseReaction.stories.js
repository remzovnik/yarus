import BaseReaction from "@/modules/Main/components/base/BaseReaction.vue";

export default {
  title: "Design System/BaseReaction",
  component: BaseReaction,

  argTypes: {
    type: {
      options: ["views", "likes", "comments", "share"],
      control: { type: "radio" },
    },

    theme: {
      options: ["default", "light"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { BaseReaction },

  setup() {
    return { args };
  },

  template: `<BaseReaction v-bind="args">${args.slot}</BaseReaction>`,
});

export const Views = Story.bind({});

Views.args = {
  slot: "1000",
  type: "views",
  theme: "default",
};

export const Likes = Story.bind({});

Likes.args = {
  slot: "1000",
  type: "likes",
  theme: "default",
};

export const Comments = Story.bind({});

Comments.args = {
  slot: "1000",
  type: "comments",
  theme: "default",
};

export const Share = Story.bind({});

Share.args = {
  slot: "1000",
  type: "share",
  theme: "default",
};
