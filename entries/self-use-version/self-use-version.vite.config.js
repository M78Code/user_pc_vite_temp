// FILE: vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import path from "path";
import viteCompression from 'vite-plugin-compression';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
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
    chunkSplitPlugin({
      strategy: 'default',  //     | 'default' | 'all-in-one' | 'single-vendor' | 'unbundle';

  

      // customChunk: CustomChunk; (context: {id:string, moduleId:string, file:string, root:string}) => string | undefined | null;
      useEntryName: false,
      // customSplitting: {
      // customSplitting: {
      //   //project\app-h5\main.js
      //   //  project\/app-h5\/main\.js/, /src\/boot\/i18n\.js/  ,/job\/output\/env/,/lodash/
      //     //  'window-global': [/project\/app-h5\/main\.js/, /src\/boot\/i18n\.js/  ,/lodash/ ],
      //     //  'core': [/src\/core/   ],
      //   // 'index': [/src\/boot\/i18n\.js/,/main.js/],
      //   // 'index': [/src\/boot\/i18n\.js/,/main.js/],
      //   //    
      //   // 'vendor-666': [ /job\/output\/env/],
      //   // 'vendor': [/node_modules/ ,/job\/output\/env/  ],
      //   //
      //   // 'code-all': [/src\/pages/,/virtual/],
   
      //   // 'other': [/score/,/stage-child/],
      //   // 'stage-child': [/stage-child/],
      //   // 'virtual': [/virtual/],
      //   'core': [/src\/core\/format/ ,   /src\/core\/utils/  ,  /src\/core\/mitt/  ,   /src\/core\/url-param-ctr/  ,    /src\/core\/constant/ ,/lodash/  ],
      //   'vendor': [/node_modules/  ,/job\/output\/env/,/src\/core\/mitt/  , ],
      //   'code-all': [/src\/pages/,/virtual/],
      // },

      // customChunk:(info)=>{
      //   // moduleId
      //   // D:/CODE-WEB/WEB/user-pc-vite/src/core/match-list-pc/match-card/module/data-relation-type-7.js D:/CODE-WEB/WEB/user-pc-vite
      //   let {moduleId ,root} = info
      //   console.log(moduleId ,root)
      //   if(moduleId.includes("node_modules")){

      //    return 'vendor--22--'
      //   }else if(moduleId.includes(root+"/job/output/env")||  moduleId.includes(root+"/src/core/mitt") ||  moduleId.includes(root+"/src/api") ){
      //     return 'vendor--22--'
      //   }else if(moduleId.includes( root+"/src/") &&   !moduleId.includes(  ".vue") ){
      //     return 'src'
      //   }else if(moduleId.includes( root+"/project/")   ){
      //     return 'project'
      //   }else{
      //     return 'code-666'
      //   }


      // }
    })
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
      // manualChunks 配置
      // manualChunks: {},
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        // chunkFileNames:(ChunkInfo)=>{
        //   // facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/src/base-pc/components/match-detail/match_info/tabs.vue',
        //   //facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/src/i18n/pc/zh-cn/index.json',
        //   let facadeModuleId = ChunkInfo.facadeModuleId
      
        //   // console.log('ChunkInfo---',ChunkInfo.facadeModuleId )
       

        //   if(facadeModuleId&&facadeModuleId.includes('/src/i18n/')){
        //     let arr = facadeModuleId.split('/')
        //     let lan_name= arr[arr.length-2]

        //     return `static/js/${lan_name}-[hash].js`
        //   }else{
        //     return "static/js/[name]-[hash].js"
        //   }
          
      

        // }


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
