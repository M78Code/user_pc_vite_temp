/**
 * 创建 本次打包的 客户端版本
 */

let DEV_TARGET_ENV_CONFIG={} 
try {
    DEV_TARGET_ENV_CONFIG = await import( "../dev-target-env.js"  );
} catch (error) {
}
const {DEV_TARGET_VERSION} = DEV_TARGET_ENV_CONFIG
import { ensure_write_folder_exist, write_file } from "./write-folder-file.js";

import { RESOLVE_BUILD_VERSION_COMMON_FN } from "./build-version-common.js";
// jenkins env 变量  配置的   构建 zip 版本参数   , 一般是运维那边 配置打包使用的    模块化打包  构建 zip 版本参数
let ENV_MODULE_SDK_VERSION = (process.env.MODULE_SDK_VERSION || "").trim();
//最终计算的 版本号
let MODULE_SDK_VERSION = ENV_MODULE_SDK_VERSION || DEV_TARGET_VERSION;
//分割字符串先 第一个项目  版本号 时间戳 环境 1全量/2差量
const [PROJECT1, MERCHANT_CONFIG_VERSION, PUCK_UP_TIME, ENVSTR] =
MODULE_SDK_VERSION.split("-");
//项目
const PROJECT ='client-sdk-dev'
//项目启动文件入口目录名字
const ENTRY_DIR_NAME = 'client-sdk-dev'
//构建目录名字
const BUILD_DIR_NAME = 'client-sdk-dev'
//是否需要 BUILD_VERSION 版本素材隔离
const NEED_BUILD_VERSION = false
//构建版本基础参数
const BUILD_VERSION_COMMON = RESOLVE_BUILD_VERSION_COMMON_FN({PROJECT,ENVSTR,BUILD_DIR_NAME,NEED_BUILD_VERSION })
//最终基础配置
const config = {
  ...BUILD_VERSION_COMMON,
  ENTRY_DIR_NAME,
  MODULE_SDK_VERSION,
  MERCHANT_CONFIG_VERSION,
  PUCK_UP_TIME,
};
// console.log(config);
let str = `export default  ${JSON.stringify(config)} `;
// 输出目录
let write_folder = "./job/output/version";
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);
