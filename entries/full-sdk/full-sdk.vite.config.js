// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from "path"
console.log(path.resolve(
  __dirname,
  "./full-sdk.install.js"
))
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
    lib: {
      entry: path.resolve(
        __dirname,
        "./full-sdk.install.js"
      ),
      name: "TY_JSSDK",
      fileName: (format) => `TY_JSSDK.${format}.js`,
    },
    // transpileDependencies: ["quasar"],
    outDir: "dist/full-sdk",
 
    rollupOptions: {
      // external: ["vue"],
      // input:{
    
      //   index: path.resolve(__dirname,'index.html')
      // },
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
      // project_path: path.join(   
     
      //   __dirname,
      //   `./src/${final_config.project_path}`
      // ),
    },
  },

})
