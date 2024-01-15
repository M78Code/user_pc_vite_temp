// FILE: vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from "path"
//本地开发端口
const port = 38800
//目标项目
const project = "check-sdk-umd-html"
//输出目录
const outDir="dist/check-sdk-umd-html/"
//基础路径
const base='/'

console.log(`调试需要打开全路径：http://localhost:${port}/project/${project}/index.html`);

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
    })
  ],
  build: {
    outDir ,
    rollupOptions: {
      // external: ["vue"],
      input:{
        index: path.resolve(__dirname, `../../project/${project}/index.html`),
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
    open: `../../project/${project}/index.html`,
    hmr: true,
},
})
