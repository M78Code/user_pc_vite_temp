/**
 * 创建 本次打包的 客户端版本
 */
import { ensure_write_folder_exist, write_file } from "./write-folder-file.js";
import { DEV_TARGET_ENV } from "../dev-target-env.js";
import { RESOLVE_BUILD_VERSION_COMMON_FN } from "./build-version-common.js";
// jenkins env 变量  配置的      
let ENV_TARGET_ENV = (process.env.TARGET_ENV || "").trim();
//最终计算的 目标环境 参数
let ENVSTR = ENV_TARGET_ENV || DEV_TARGET_ENV;

//项目
const PROJECT ='activity'
//项目启动文件入口目录名字
const ENTRY_DIR_NAME = 'activity'
//构建目录名字
const BUILD_DIR_NAME = 'activity'
//构建版本基础参数
const BUILD_VERSION_COMMON = RESOLVE_BUILD_VERSION_COMMON_FN({PROJECT,ENVSTR ,BUILD_DIR_NAME})
 //最终基础配置
  const config = {
    ...BUILD_VERSION_COMMON,
    ENTRY_DIR_NAME,
    
  };
  // console.log(config);
let str = `export default  ${JSON.stringify(config)} `;
// 输出目录
let write_folder = "./job/output/version";
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);


 
 
 


 