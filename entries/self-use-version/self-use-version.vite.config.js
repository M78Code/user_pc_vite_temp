// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from "path"


console.log("-------------__dirname---------",__dirname);


 import FINAL_MERCHANT_CONFIG from "../../job/output/merchant/config.json"  



 let {project} = FINAL_MERCHANT_CONFIG

 if(!project){

  console.error('目标项目必须设定 ----------');
  console.error('进程结束');
  
 }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      sassVariables: 'src/css/quasar-variables.scss'
    })
  ],
  build: {
    // lib: {
    //   entry: path.resolve(
    //     __dirname,
    //     "./build/build-jssdk/build-jssdk.install.js"
    //   ),
    //   name: "TY_JSSDK",
    //   fileName: (format) => `TY_JSSDK.${format}.js`,
    // },
    // transpileDependencies: ["quasar"],
    outDir: "dist/self-use-version",
 
    rollupOptions: {
      // external: ["vue"],
      input:{
        // index: path.resolve(__dirname,'/entries/self-use-version/index.html')
        index: path.resolve(__dirname,'index.html')
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
   
      src: "./src",
      app: "./",
      dist: "./dist",
      node_modules: "./node_modules",
      public: "./public",
      project_path: `../${project}`,
    },
  },
  server:{
    port:28300,
    open: 'entries/self-use-version/index.html',
    hmr:true
  }

})
