const { mergeConfig } = require("vite");
const { createSvgIconsPlugin } = require("vite-plugin-svg-icons");
const path = require("path");

module.exports = {
  stories: ["../src/stories/*.stories.js"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: "@storybook/vue3",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        createSvgIconsPlugin({
          iconDirs: [path.resolve(process.cwd(), "./src/assets/icons")],
          symbolId: "icon-[name]",

          customDomId: "__svg__icons__dom__",
        }),
      ],
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "./src/assets/styles/_variables.scss";
              @import "./src/assets/styles/_mixins.scss";
              @import "./src/assets/styles/_typography.scss";
            `,
          },
        },
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
    });
  },
};
