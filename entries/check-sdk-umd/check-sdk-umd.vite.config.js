// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from "path"

  
//本地开发端口
const port = 38400
// entries\check-sdk-umd\index.html
// http://localhost:38400/project/ouzhou-h5/index.html
// http://localhost:38400/entries/check-sdk-umd/index.html

console.log(`调试需要打开全路径：http://localhost:38400/entries/check-sdk-umd/index.html`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({

    })
  ],
  build: {
 
    outDir: "dist/check-sdk-umd",
 
    rollupOptions: {
      // external: ["vue"],
      input:{
   
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
        src: path.resolve(process.cwd(), "./src"),
        app: path.resolve(process.cwd(), "./"),
        dist: path.resolve(process.cwd(), "./dist"),
        project: path.resolve(__dirname, '../../project'),
        node_modules: path.resolve(process.cwd(), "./node_modules"),
        public: path.resolve(__dirname, '../../public')
    },
},
server: {
    port,
    open: `./index.html`,
    open: `../../entries/check-sdk-umd/index.html`,
    hmr: true,
},

})
