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
const PROJECT ='animation-page'
//项目启动文件入口目录名字
const ENTRY_DIR_NAME = 'animation-page'
//构建目录名字
const BUILD_DIR_NAME = 'animation-page'
//是否需要 BUILD_VERSION 版本素材隔离
const NEED_BUILD_VERSION = true
//是否是主题类项目 域名规则  topic.aa.com/${PROJECT}/${topic-layout-key}/${topic-content-key}
const IS_TOPIC_PROJECT =true
//主题项目布局标识 : 目前活动项目就一个布局版本
const TOPIC_PROJECT_LAYOUT_KEY = 'common'
//主题项目内容标识 ：目前活动项目 KY 只是色系不同，内容差异不大，部分内容是接口控制。 遵守topic 项目设计规范 这里一样设计上，方便后期扩展以及维护
const TOPIC_PROJECT_CONTENT_KEY= 'common'
//主题项目构建类型标识
const TOPIC_PROJECT_BUILD_TYPE_KEY ="TOPIC_PROJECT_BUILD_TYPE_6"
//构建版本基础参数
const BUILD_VERSION_COMMON = RESOLVE_BUILD_VERSION_COMMON_FN({PROJECT,ENVSTR ,BUILD_DIR_NAME,NEED_BUILD_VERSION ,IS_TOPIC_PROJECT,TOPIC_PROJECT_LAYOUT_KEY,TOPIC_PROJECT_CONTENT_KEY,TOPIC_PROJECT_BUILD_TYPE_KEY})
 //最终基础配置
  const config = {
    ...BUILD_VERSION_COMMON,
    ENTRY_DIR_NAME,
    
  };
  // console.log(config);
let str = `export default  ${JSON.stringify(config)} `;
// 输出目录
let write_folder = "./job/output/version";
 
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);


 
 
 


 