/**
 * 删除 服务器上可能的历史版本输出缓存，确保不出错
 */
import colors from "colors" 
import { remove_file } from "../util-and-config/write-folder-file.js";
console.log("----process.argv---", process.argv);
// 代码内 配置的          ，一般是  本地测试 打包指定版本用

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "../output/version/build-version.js";
const { BUILD_VERSION, NEED_DELETE_PROJECT=[] ,PROJECT_NAME,BUILD_DIR_NAME ,
  BUILD_OUTDIR,
  BUILD_STATIC_DIR_PATH,
  BUILD_STATIC_DIR_TARGET_PATH,
  BUILD_STATIC_DIR_NEED_CHANGE,
  PUBLIC_STATIC_OTHER_DIR,
 

} = BUILD_VERSION_CONFIG;
 
 


 //原 public 下的 静态素材   打包后的 地址   需要进行改变
if(BUILD_STATIC_DIR_NEED_CHANGE){

  
 let all_static = [ PROJECT_NAME,...NEED_DELETE_PROJECT,...PUBLIC_STATIC_OTHER_DIR]

  for(let i =0 ;i<all_static.length;i++){
    let name = all_static[i]
    let folder = `${BUILD_STATIC_DIR_PATH}${name}/`
    console.log( colors.red( `当前  remove-dist-assets  执行删除以下静态资源： ${folder}`) );
    remove_file(folder);
  
  }
  
  console.log(
    colors.red( `remove-dist-assets 执行完成  `)
   
  );
  



}else{
 //原 public 下的 静态素材   打包后的 地址   不需要进行改变

  console.log(
    colors.red( `当前  remove-dist-assets  将保留以下静态资源： ${BUILD_STATIC_DIR_PATH}${PROJECT_NAME}/`)
  );

  for(let i =0 ;i<NEED_DELETE_PROJECT.length;i++){
    let name = NEED_DELETE_PROJECT[i]
    let folder = `${BUILD_STATIC_DIR_PATH}${name}/`
    console.log( colors.red( `当前  remove-dist-assets  执行删除以下静态资源： ${folder}`) );
    remove_file(folder);
  
  }
  
  console.log(
    colors.red( `remove-dist-assets 执行完成  `)
   
   
  );
  
   


}


