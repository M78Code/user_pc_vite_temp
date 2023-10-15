/**
 * 根据环境 计算当前的 环境相关的项目配置，项目打包的外层植入层
 * @param {*} current_env
 * @returns
 */
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
 const {BUILD_VERSION ,IS_PROD ,NODE_ENV} = BUILD_VERSION_CONFIG
// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
// 商户版本号
const { MERCHANT_CONFIG_VERSION    } = final_merchant_config;

// 模块化打包 构建 zip 版本参数
let MODULE_SDK_VERSION =   ( process.env.MODULE_SDK_VERSION|| "").trim()   ;

import { compute_build_in_oss_by_current_env  } from "./build-in-oss.js";
import { htmlVariables } from "./html-variables.js";

import {compute_oss_file_path_arr} from "./copy-oss.js"
// 代理映射设置key
const API_PREFIX = {
  "API_PREFIX_API": "yewu7",
  "API_PREFIX_USER": "yewu12",
  "API_PREFIX_JOB": "yewu11",
  "API_PREFIX_BAT": "yewu13",
  "API_PREFIX_FILE": "file",
  "API_PREFIX_WBSOCKET": "yewuws2",
  "API_PREFIX_FILE_REAL": "file",
  "API_PREFIX_ACTIVITY": 'yewu19'
};
/**
 * 计算 最终的 打包植入到代码内的 配置 OSS 除外
 * @param {*} current_env
 * @returns
 */
export const compute_build_in_config = (current_env) => {
  let current_env_build_in_oss = "";
  console.log("--------------------------开始构建--------------------------");
  // console.log(process.argv );
 
  // 当前环境代码内内置 写入的兜底 oss
  current_env_build_in_oss = compute_build_in_oss_by_current_env(current_env);
  //  项目名称   yazhou-h5 yazhou-pc
  let TARGET_PROJECT_NAME =   final_merchant_config.project ;
  // 埋点Google Analytics GA_TRACKING_ID
  let GA_TRACKING_ID = "G-3SFG732R1J"; // 生产环境
  // 最终项目配置信息
  let final_config = {};
  //功能启用   禁用开关  顶层
  const LOCAL_FUNCTION_SWITCH = {
    // 日志服务开关
    LOG: false,
    // 前端控制是否禁用收藏功能
    ENABLE_COLLECT_API: true,
    // 自动化测试 标签id开关
    DOM_ID_SHOW: process.env.FRONT_WEB_ENV_AUTO_TEST == "1",
    // 是否自动设置域名相关的地址
    AUTO_API: process.env.AUTO_API || false,
  };
  let hidApi =
    current_env == "idc_online"
      ? "https://www.googletagmanager.com/gtag/js?id=" + GA_TRACKING_ID
      : "";
  // 测试环境时使用
  if (current_env == "local_test") {
    // // 隔离环境时使用
    // if(current_env=='idc_lspre'){
    GA_TRACKING_ID = "G-H3XWBEMYYL";
    hidApi = "https://www.googletagmanager.com/gtag/js?id=" + GA_TRACKING_ID;
  }
  // 其他需要植入到  html 内的变量
  let other_htmlVariables = {
    // 增加埋点api配置
    hidApi: hidApi,
    // 埋点Google Analytics GA_TRACKING_ID
    GA_TRACKING_ID,
    // 当前环境
    current_env,
    BUILD_VERSION   ,
    IS_PROD  ,
    NODE_ENV,
     
 
    
    current_env_build_in_oss: encodeURIComponent(
      JSON.stringify(current_env_build_in_oss.data)
    ),
  };
  // 合并 所有内容
  final_config = {
    CURRENT_ENV: current_env,
 
    LOCAL_FUNCTION_SWITCH,  
    SERVER_GLOBAL_SWITCH:{},
    GLOBAL_IMAGE_PREFFIX:  IS_PROD ? '/' + BUILD_VERSION:''  ,
    API_PREFIX,
    FRONT_WEB_ENV: process.env.FRONT_WEB_ENV,
    API_DOMAIN_PREFIX: "api",
    MERCHANT_CONFIG_VERSION,
    MODULE_SDK_VERSION,
    TARGET_PROJECT_NAME,
    OSS_FILE_ARR:compute_oss_file_path_arr(current_env),
    OSS_FILE_NAME: current_env_build_in_oss.file,
    CURRENT_ENV_NAME: current_env_build_in_oss.file,
    htmlVariables:  {
      ...htmlVariables,
      ...other_htmlVariables,
    }
  } 
// console.log('current_env-------',current_env  ,final_config);
  return final_config;
};
