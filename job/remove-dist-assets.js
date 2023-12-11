/**
 * 删除 服务器上可能的历史版本输出缓存，确保不出错
 */
import colors from "colors" 
import { remove_file } from "./write-folder-file.js";
console.log("----process.argv---", process.argv);
// 代码内 配置的          ，一般是  本地测试 打包指定版本用

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
const { BUILD_VERSION, NEED_DELETE_PROJECT=[] ,PROJECT_NAME,BUILD_DIR_NAME ,BUILD_OUTDIR} = BUILD_VERSION_CONFIG;
 
//打包后的资源文件所在的基础路径
let  base_folder= `./${BUILD_OUTDIR}/`


console.log(
  colors.red( `当前  remove-dist-assets  将保留以下静态资源： ${base_folder}${PROJECT_NAME}/`)
 
 
);

for(let i =0 ;i<NEED_DELETE_PROJECT.length;i++){
  let name = NEED_DELETE_PROJECT[i]
  let folder = `${base_folder}${name}/`
  console.log( colors.red( `当前  remove-dist-assets  执行删除以下静态资源： ${folder}`) );
  remove_file(folder);

}

console.log(
  colors.red( `remove-dist-assets 执行完成  `)
 
 
);

 