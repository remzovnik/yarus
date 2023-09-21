import ProfileLink from "@/modules/Main/components/profile/ProfileLink.vue";

export default {
  title: "Design System/ProfileLink",
  component: ProfileLink,

  argTypes: {
    type: {
      options: ["profile", "account", "channel"],
      control: { type: "radio" },
    },

    theme: {
      options: ["dark", "light"],
      control: { type: "radio" },
    },
  },
};

const Story = (args) => ({
  components: { ProfileLink },

  setup() {
    return { args };
  },

  template: `<ProfileLink v-bind="args">${args.slot}</ProfileLink>`,
});

export const Profile = Story.bind({});

Profile.args = {
  slot: "Название",
  type: "profile",
  image: "/images/default-avatar.png",
  name: "Имя профиля",
  nickname: "никнейм",
};

export const Account = Story.bind({});

Account.args = {
  slot: "Название",
  type: "account",
  image: "/images/default-avatar.png",
  name: "Имя профиля",
  nickname: "никнейм",
};

export const Channel = Story.bind({});

Channel.args = {
  slot: "Название",
  type: "channel",
  image: "/images/default-avatar.png",
  name: "Имя профиля",
  subscribers: 14000,
};
