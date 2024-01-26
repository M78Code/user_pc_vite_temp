/**
 * 创建 本次打包的  版本配置相关信息
 */
let DEV_TARGET_ENV_CONFIG={} 
try {
    DEV_TARGET_ENV_CONFIG = await import( "../../dev-target-env.js"  );
} catch (error) {
}
const {DEV_TARGET_ENV} = DEV_TARGET_ENV_CONFIG
import {  write_file } from "../util-and-config/write-folder-file.js";
import { RESOLVE_BUILD_VERSION_COMMON_FN } from "./build-version-common.js";
// jenkins env 变量  配置的      
let ENV_TARGET_ENV = (process.env.TARGET_ENV || "").trim();
//最终计算的 目标环境 参数
let ENVSTR = ENV_TARGET_ENV || DEV_TARGET_ENV;
//项目
const PROJECT ='animation'
//项目启动文件入口目录名字
const ENTRY_DIR_NAME = 'animation'
 //构建目录名字
const BUILD_DIR_NAME = 'animation'
//是否需要 BUILD_VERSION 版本素材隔离
const NEED_BUILD_VERSION = true
//构建版本基础参数
const BUILD_VERSION_COMMON = RESOLVE_BUILD_VERSION_COMMON_FN({PROJECT,ENVSTR,BUILD_DIR_NAME,NEED_BUILD_VERSION })
 //最终基础配置
  const config = {
    ...BUILD_VERSION_COMMON,
    ENTRY_DIR_NAME
  
  };
  // console.log(config);
let str = `export default  ${JSON.stringify(config)} `;
// 输出目录
let write_folder = "./job/output/version";
 
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);
