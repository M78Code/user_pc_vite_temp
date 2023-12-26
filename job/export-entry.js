
import * as path from "node:path";
import fs from "node:fs";
import lodash from "lodash";
import colors from "colors";
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
// 商户版本 最终配置
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
let { PROJECT_NAME,IS_MAIN_PROJECT  } = BUILD_VERSION_CONFIG;




let final_str=''


if(IS_MAIN_PROJECT){
// 客户端主要项目
// ` src/base-${project.includes('pc')?'pc':'h5'}`

let base_path= `src/base-${PROJECT_NAME.includes('pc')?'pc':'h5'}`

final_str=`
// export * as  PROJECT_STORE from "${base_path}/store";
export const  PROJECT_STORE={}
export * as  MITT_TYPES_BASE from "${base_path}/core/mitt/mitt-keys.js" 
export * as  MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js" 

`


}else{
// 次要项目 

final_str=`
// export * as  PROJECT_STORE from "project_path/src/store";
export const  MITT_TYPES_BASE={}
export const  PROJECT_STORE={}
export * as  MITT_TYPES_PROJECT from "project_path/src/core/mitt/mitt-keys.js" 
`



}







 

// 商户配置 输出目录
let write_folder = "./job/output/entry/";
 
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);


write_file(write_folder +  'index.js',  final_str)