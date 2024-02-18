import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from "path"
 
//本地开发端口
const port = 28500
console.log("---------启动文件入口目录-------------", __dirname);

import COMPUTE_ENTRY_CONFIG from "../../job/entry/entry-config.js";
//入口配置
const  { project, outDir, base,} = COMPUTE_ENTRY_CONFIG({port})
// https://vitejs.dev/config/
// https://cn.vitejs.dev/guide/build
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      sassVariables: `app/job/output/css/variables.scss`,
    })
  ],
  build: {
    lib: {
      entry: path.resolve( __dirname, "../../project/client-sdk/main-build.js" ),
      name: "TY_JSSDK",
      fileName: (format) => `TY_JSSDK.${format}.js`,
    },
    // transpileDependencies: ["quasar"],
    outDir ,
 
    rollupOptions: {
      // external: ["vue"],
 
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
     extensions:['.js','.vue','.json'], // 自动添加文件名后缀    
  alias: {
   
      src: path.resolve(process.cwd(), "./src"),
      app: path.resolve(process.cwd(), "./"),
      dist: path.resolve(process.cwd(), "./dist"),
      project: path.resolve(__dirname, '../../project'),
      node_modules: path.resolve(process.cwd(), "./node_modules"),
      public: path.resolve(__dirname, '../../public')
    },
  },

})
