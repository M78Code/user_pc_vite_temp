// FILE: vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import path from "path";
import viteCompression from 'vite-plugin-compression';

import BUILDIN_CONFIG from "../../job/output/env/index.js";;
 
const {BUILD_VERSION ,PROJECT_NAME} =  BUILDIN_CONFIG
//本地开发端口
const port = 28300
console.log("---------启动文件入口目录-------------", __dirname);

import COMPUTE_ENTRY_CONFIG from "../../job/entry-config.js";
//入口配置
const  { project, outDir, base} = COMPUTE_ENTRY_CONFIG({port})
 

const chunkSplitPlugin1=()=>{}
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
      // https://rollupjs.org/configuration-options/
      // https://github.com/sanyuan0704/vite-plugin-chunk-split/blob/master/README-CN.md
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          // "vue3-draggable-resizable": "vue3-draggable-resizable",
        },
   
       // manualChunks: {},
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
  esbuild:{
    pure: ['console.log'], // 删除 console.log
    drop: ['debugger'], // 删除 debugger
    // drop: ['console,'debugger'], // 删除 所有的console 和 debugger
 },
  resolve: {
     extensions:['.js','.vue','.json'], // 自动添加文件名后缀    
  alias: {
      src: path.resolve(process.cwd(), "./src"),
      app: path.resolve(process.cwd(), "./"),
      dist: path.resolve(process.cwd(), "./dist"),
      node_modules: path.resolve(process.cwd(), "./node_modules"),
      public: path.resolve(process.cwd(), `./public/${project}`),
      project_path: path.resolve(process.cwd(), `./project/${project}`),
 
    },
  },
  server: {
    port,
    host: '0.0.0.0',
    open: false,
    hmr: true,
  },
});
