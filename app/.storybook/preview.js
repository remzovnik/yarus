import { app } from "@storybook/vue3";
import "virtual:svg-icons-register";
import "../src/assets/styles/index.scss";
import MaskDirective from "@/_core/utils/MaskDirective";

app.directive("imask", MaskDirective());

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
