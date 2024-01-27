/**
 * 创建 本次打包的  版本配置相关信息
 */

import {import_js_data ,write_file} from  "../util-and-config/write-folder-file.js"
const  DEV_TARGET_ENV_CONFIG= await import_js_data("./dev-target-env.js")
const {DEV_TARGET_VERSION  } = DEV_TARGET_ENV_CONFIG
 

import { RESOLVE_BUILD_VERSION_COMMON_FN } from "./build-version-common.js";
// jenkins env 变量  配置的   构建 zip 版本参数   , 一般是运维那边 配置打包使用的    模块化打包  构建 zip 版本参数
let ENV_MODULE_SDK_VERSION = (process.env.MODULE_SDK_VERSION || "").trim();
//最终计算的 版本号
let MODULE_SDK_VERSION = ENV_MODULE_SDK_VERSION || DEV_TARGET_VERSION;
//分割字符串先 第一个项目  版本号 时间戳 环境 1全量/2差量
const [PROJECT, MERCHANT_CONFIG_VERSION, PUCK_UP_TIME, ENVSTR] =
MODULE_SDK_VERSION.split("-");
//项目启动文件入口目录名字
const ENTRY_DIR_NAME = 'self-use-version'
//构建目录名字
const BUILD_DIR_NAME = 'self-use-version'
//是否需要 BUILD_VERSION 版本素材隔离
const NEED_BUILD_VERSION = true
//构建版本基础参数
const BUILD_VERSION_COMMON = RESOLVE_BUILD_VERSION_COMMON_FN({PROJECT,ENVSTR,BUILD_DIR_NAME ,NEED_BUILD_VERSION})
const {PROJECT_NAME} = BUILD_VERSION_COMMON
//最终基础配置
const config = {
  ...BUILD_VERSION_COMMON,
  ENTRY_DIR_NAME,
  MODULE_SDK_VERSION,
  IS_PC:  PROJECT_NAME.includes('pc'),
  MERCHANT_CONFIG_VERSION,
  PUCK_UP_TIME,
};
 
// console.log(config);
let str = `export default  ${JSON.stringify(config)} `;
// 输出目录
let write_folder = "./job/output/version";
 
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);
