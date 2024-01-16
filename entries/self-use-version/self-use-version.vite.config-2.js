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

let workspace_root =  (__dirname).split('entries')[0].replaceAll("\\",'/')

console.log("---------项目根目录-------------", workspace_root);
import COMPUTE_ENTRY_CONFIG from "../../job/entry-config.js";
//入口配置
const  { project, outDir, base} = COMPUTE_ENTRY_CONFIG({port})
const  randomstring=(n=16)=>{

  let result=''
  let str="ABCDEFGH1KLMNOPQRSTUVWXYZabCdefghijk1mnopqrstuVWxyz0123456789"
  for(let i=0;i<n;i++){
  

      let i = Math.floor(Math.random()* (str.length))
      result+= str[i]  

  }
    
   return result

}

//  'D:/CODE-WEB/WEB/user-pc-vite/src/base-pc/components/match-detail/match_info/tabs.vue', 
//
const to_formatted_path=(url='')=>{
 
 let surl= url.split(workspace_root)[1] ||''

 if(surl){

  return surl.replaceAll("/",'__')
 }else{
  return    randomstring(20)+'-'+ (  Math.ceil(Math.random()*1000000 ))
 }
}

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
      // manualChunks 配置
      // https://rollupjs.org/configuration-options/#output-manualchunks
      manualChunks111:(facadeModuleId,{getModuleInfo,getModuleIds} )=>{
     
        console.log('manualchunks-----info----facadeModuleId---',facadeModuleId )
        console.log('manualchunks-----info----getModuleInfo---', JSON.stringify(getModuleInfo(facadeModuleId)) )
        // console.log('manualchunks-----info----getModuleIds---',JSON.stringify( Array.from(  getModuleIds())) )
      

    



        if (facadeModuleId) {
             // D:/CODE-WEB/WEB/user-pc-vite/project/app-h5/index.html
          let name_index_html = facadeModuleId.includes(  `${workspace_root}project/${PROJECT_NAME}/index.html`);
          let name_i18n = facadeModuleId.includes("/src/i18n/");
          let name_index_entry = facadeModuleId.includes("/job/output/env/") 
          || facadeModuleId.includes("/node_modules/") 
          || facadeModuleId.includes("quasar") 
          || facadeModuleId.includes("/src/directives/") 
          || facadeModuleId.includes("/src/core/constant/common/") 
          || facadeModuleId.includes("/src/core/constant/global/") 
          || facadeModuleId.includes("/src/core/utils/common/") 
          || facadeModuleId.includes("/core/mitt/") 
          || facadeModuleId.includes("/src/boot/i18n") 
          || facadeModuleId.includes("src/core/file-path/") 
          || facadeModuleId.includes("src/core/log/") 
           ;
          
           let name_project  = facadeModuleId.includes(`/project/${PROJECT_NAME}/`);
           let name_base  = facadeModuleId.includes( workspace_root+"src/");
           
           console.log('manualchunks-----info---------name_i18n---',  name_i18n  )
           console.log('manualchunks-----info--------name_index_entry---',  name_index_entry  )
           if(name_index_html){

            return `vender`;
          
           }else  if (name_i18n) {
            let arr = facadeModuleId.split("/");
            let lan_name = arr[arr.length - 2];

            return `i18n-${lan_name}`;

          } else if (name_index_entry) {
            // -${BUILD_VERSION}
            return `vender`;
          } else if (name_project) {
            // return `project-${PROJECT_NAME}`;
            return to_formatted_path(facadeModuleId)
          } else if (name_base) {
            return to_formatted_path(facadeModuleId)
            return `src-base`;
            return to_formatted_path(facadeModuleId)
          }  else {
            return to_formatted_path(facadeModuleId)
            return "other";
          }
        } else {
          return to_formatted_path(facadeModuleId)
          return "other";
        }









      },
      // manualChunks: {},
        // chunkFileNames: "static/js/[name].js",
        // entryFileNames: "static/js/[name]-[hash].js",
        // assetFileNames: "static/[ext]/[name]-[hash].[ext]",

        chunkFileNames1111:(ChunkInfo)=>{
          // facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/src/base-pc/components/match-detail/match_info/tabs.vue',
          //facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/src/i18n/pc/zh-cn/index.json',
          let facadeModuleId = ChunkInfo.facadeModuleId
      
          // console.log('ChunkInfo---',ChunkInfo.facadeModuleId )
       

          // chunkFileNames---ChunkInfo--- {
          //   exports: [ 'common_lang', 'default' ],
          //   facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/src/i18n/h5/common-lang/index.json',
          //   isDynamicEntry: true,
          //   isEntry: false,
          //   isImplicitEntry: false,
          //   moduleIds: [ 'D:/CODE-WEB/WEB/user-pc-vite/src/i18n/h5/common-lang/index.json' ],
          //   name: 'index',
          //   type: 'chunk'
          // }


          console.log('chunkFileNames---ChunkInfo---',  JSON.stringify(ChunkInfo)   )
          // console.log('chunkFileNames---ChunkInfo---',  ChunkInfo  )

          if (facadeModuleId) {
            // D:/CODE-WEB/WEB/user-pc-vite/project/app-h5/index.html
            let name_index_html = facadeModuleId.includes(workspace_root+"project/app-h5/index.html");
            let name_i18n = facadeModuleId.includes("/src/i18n/");
            let name_index_entry = facadeModuleId.includes("/job/output/env/") 
            || facadeModuleId.includes("/node_modules/") 
            || facadeModuleId.includes("quasar") 
            || facadeModuleId.includes("/src/directives/") 
            || facadeModuleId.includes("/src/core/constant/common/") 
            || facadeModuleId.includes("/src/core/constant/global/") 
            || facadeModuleId.includes("/src/core/utils/common/") 
            || facadeModuleId.includes("/core/mitt/") 
            || facadeModuleId.includes("/src/boot/i18n") 
            || facadeModuleId.includes("src/core/file-path/") 
            || facadeModuleId.includes("src/core/log/") 
             ;
            
             let name_project  = facadeModuleId.includes(`/project/${PROJECT_NAME}/`);
             let name_base  = facadeModuleId.includes( workspace_root+"src/");
             
             console.log('chunkFileNames---ChunkInfo-----name_i18n---',  name_i18n  )
             console.log('chunkFileNames---ChunkInfo-----name_index_entry---',  name_index_entry  )
            if(name_index_html){

          
          
            }else  if (name_i18n) {
              let arr = facadeModuleId.split("/");
              let lan_name = arr[arr.length - 2];

              return `static/js/${lan_name}-[hash].js`;

            } else if (name_index_entry) {
              // -${BUILD_VERSION}
              return `static/js/index-entry.js`;
            } else if (name_project) {
              return `static/js/project-${PROJECT_NAME}.js`;
            } else if (name_base) {
              return `static/js/src-base.js`;
            }  else {
              return "static/js/[name]-[hash].js";
            }
          } else {
            return "static/js/[name]-[hash].js";
          }
       
          
          
          // return  "static/js/[name]-[hash].js"

        },
        entryFileNames111:(ChunkInfo)=>{

          // entryFileNames---ChunkInfo--- {
          //   exports: [
          //     '$',  'A',  'B',  'C',  'D',  'E',  'F',  'G',  'H',  'I',
          //     ... 197 more items
          //   ],
          //   facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/project/app-h5/index.html',
          //   isDynamicEntry: false,
          //   isEntry: true,
          //   isImplicitEntry: false,
          //   moduleIds: [
          //     '\x00vite/modulepreload-polyfill',
          //     'D:/CODE-WEB/WEB/user-pc-vite/project/app-h5/index.html?html-proxy&inline-css&index=0.css',
          //     'D:/CODE-WEB/WEB/user-pc-vite/node_modules/@vue/shared/dist/shared.esm-bundler.js',
          //     'D:/CODE-WEB/WEB/user-pc-vite/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js',
          //     'D:/CODE-WEB/WEB/user-pc-vite/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js',
          //     ... 1061 more items
          //   ],
          //   name: 'index',
          //   type: 'chunk'
          // }

          //只有 入口 html 
          //  facadeModuleId: 'D:/CODE-WEB/WEB/user-pc-vite/project/app-h5/index.html',
          // console.log('entryFileNames---ChunkInfo---',  JSON.stringify(ChunkInfo)    )
          // console.log('entryFileNames---ChunkInfo---',  ChunkInfo  )
              //  return  "static/js/[name]-[hash].js"

               return  `static/js/index-entry-55.js`

        },
        assetFileNames111:(AssetInfo)=>{
            // 字体 图片 
          // AssetInfo ={
          //   name:'anchor.svg',
          //   source:'源文件字节码',
          //   type: 'asset'
          // }
          // let {name,type}=  AssetInfo

          // console.log('assetFileNames---AssetInfo---',   JSON.stringify(  {name,type})   )
           return  "static/[ext]/[name]-[hash].[ext]"
        }


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
     open: `../../project/${project}/index.html`,
    // open:    "../../project/yazhou-pc/index.html" ,
    hmr: true,
  },
});
