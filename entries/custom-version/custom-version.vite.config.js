// FILE: vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from "path"
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
    outDir: "dist/custom-version",
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
     extensions:['.js','.vue','.json'], // 自动添加文件名后缀    
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
  server:{
    port:28600,
    open: 'entries/custom-version/index.html',
    hmr:true
  }
})
