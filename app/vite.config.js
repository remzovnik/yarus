import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import OptimizationPersist from "vite-plugin-optimize-persist";
import PkgConfig from "vite-plugin-package-config";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import pluginRewriteAll from "vite-plugin-rewrite-all";
import viteCompression from "vite-plugin-compression";
import del from "rollup-plugin-delete";
import { smallerThanTstampRegex } from "./src/_core/utils/RegexUtils.ts";

const WEEK_IN_MS = 604800 * 1000;
const todayTstamp = new Date().getTime();
const weekOldTstamp = todayTstamp - WEEK_IN_MS;
const weekOldBundles = smallerThanTstampRegex(weekOldTstamp);

export default defineConfig({
  plugins: [
    vue(),
    PkgConfig(),
    OptimizationPersist(),
    pluginRewriteAll(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[name]",

      customDomId: "__svg__icons__dom__",
    }),
    viteCompression(),
    del({ targets: `output/assets/${weekOldBundles}` }),
  ],
  optimizeDeps: { exclude: ["swiper/vue", "swiper/types"] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
  },

  build: {
    outDir: path.resolve(__dirname, "output"),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/${todayTstamp}/[name].[hash].js`,
        chunkFileNames: `assets/${todayTstamp}/[name].[hash].js`,
        assetFileNames: `assets/${todayTstamp}/[name].[hash].[ext]`,
      },
    },
    target: ["es2020"],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/styles/_variables";
          @import "./src/assets/styles/_typography";
          @import "./src/assets/styles/_mixins";
        `,
      },
    },
  },
});
