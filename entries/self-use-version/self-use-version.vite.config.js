// FILE: vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import path from "path";
import viteCompression from 'vite-plugin-compression';

//本地开发端口
const port = 28300
console.log("---------启动文件入口目录-------------", __dirname);
import COMPUTE_ENTRY_CONFIG from "../../job/entry-config.js";
//入口配置
const  { project, outDir, base} = COMPUTE_ENTRY_CONFIG({port})

// https://vitejs.dev/config/
export default defineConfig({
  base  ,
 
  plugins: [
    vue({
      template: { 
        transformAssetUrls,
        compilerOptions: {
          isCustomElement: (tag) => tag == 'marquee'
        }
       },
    }),

    quasar({
      sassVariables: `app/job/output/css/variables.scss`,
      
    }),
    viteCompression(),
  ],
  css:{
    devSourcemap: true,
  },
  build: {
    outDir ,
    rollupOptions: {
      // external: ["vue3-draggable-resizable"],
      input: {

      index: path.resolve(__dirname, `../../project/${project}/index.html`),
      // index: path.resolve(__dirname, `index.html`),
     
      },
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          // "vue3-draggable-resizable": "vue3-draggable-resizable",
        },
      },
    },
  },
  esbuild:{
    pure: ['console.log'], // 删除 console.log
    drop: ['debugger'], // 删除 debugger
    // drop: ['console,'debugger'], // 删除 所有的console 和 debugger
 },
  resolve: {
    alias: {
      src: path.resolve(process.cwd(), "./src"),
      app: path.resolve(process.cwd(), "./"),
      dist: path.resolve(process.cwd(), "./dist"),
      node_modules: path.resolve(process.cwd(), "./node_modules"),
      public: path.resolve(process.cwd(), `./public/${project}`),
      project_path: path.resolve(process.cwd(), `./project/${project}`),
      base_path: path.resolve(process.cwd(), `./src/base-${project.includes('pc')?'pc':'h5'}`),
    },
  },
  server: {
    port,
    host: '0.0.0.0',
     open: `../../project/${project}/index.html`,
    // open:    "../../project/yazhou-pc/index.html" ,
    hmr: true,
  },
});
