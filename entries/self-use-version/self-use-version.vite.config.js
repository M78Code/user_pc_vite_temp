// FILE: vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import path from "path";

console.log("-------------__dirname---------", __dirname);

import FINAL_MERCHANT_CONFIG from "../../job/output/merchant/config.json";

let { project } = FINAL_MERCHANT_CONFIG;

if (!project) {
  console.error("目标项目必须设定 ----------");
  console.error("进程结束");
  process.exit(1)
} else {
  console.log("-------------project---------", project);
  console.log('');
  console.log('');
  console.log('');
  console.log('本地开发需要打开全路径：');
  console.log(`http://127.0.0.1:28300/${project}/yazhou-pc/index.html`);
  console.log('');
  console.log('');
  console.log('');
}

 
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: `app/project/${project}/src/css/quasar-variables.scss`,
    }),
  ],
    // root: path.resolve(__dirname, `../../project/${project}/`),
  build: {
    outDir: "dist/self-use-version",
    rollupOptions: {
      // external: ["vue"],
      input: {
      //   // index: path.resolve(__dirname,'/entries/self-use-version/index.html')
      //   // index: `../../project/${project}/index.html`
      index: path.resolve(__dirname, `../../project/${project}/index.html`),
        // index: path.resolve(__dirname, "../../project/yazhou-pc/index.html")
        //  index:  "../../project/yazhou-pc/index.html"
      },
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          // vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(process.cwd(), "./src"),
      app: path.resolve(process.cwd(), "./"),
      dist: path.resolve(process.cwd(), "./dist"),
      node_modules: path.resolve(process.cwd(), "./node_modules"),
      project_path: path.resolve(process.cwd(), `./project/${project}`),
    },
  },
  server: {
    port: 28300,
    // open: `../../project/${project}/index.html`,
    // open:    "../../project/yazhou-pc/index.html" ,
    hmr: true,
  },
});
