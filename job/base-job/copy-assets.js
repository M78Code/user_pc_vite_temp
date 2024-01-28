/**
 * 删除 服务器上可能的历史版本输出缓存，确保不出错
 */
import colors from "colors" 
import { remove_file,copy_dir } from "../write-folder-file.js";
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

  let all_static = [ PROJECT_NAME, ...PUBLIC_STATIC_OTHER_DIR]


  all_static.map(x=>{

    copy_dir(`./public/${x}/`,`${BUILD_STATIC_DIR_TARGET_PATH}${x}/`)


  })



}else{
  
  
  console.log(
    colors.red( `copy-assets  执行完成  `)
   
   
  );
  
   


}


