
/**
 * 根据环境 计算当前的 环境相关的项目配置，项目打包的外层植入层
 * @param {*} current_env 
 * @returns 
 */


const compute_final_config=(current_env)=>{

// MERCHANT-CONFIG-VERSION


  let compute_build_in_oss_by_current_env = require("./build-in-oss.js")
  let current_env_build_in_oss=''
  let BUILD_VERSION = require('./version.js').BUILD_VERSION;
  // 模块化打包 构建 zip 版本参数
  let MODULE_SDK_VERSION =   ( process.env.SHIWAN_MODULE_SDK_VERSION|| "").trim()   ;

  if(process.env.NODE_ENV == 'development'){
    BUILD_VERSION = ''
  }


  // 日志服务开关
  const LOG = false;
  // 自动化测试 标签id开关
  let DOM_ID_SHOW = process.env.FRONT_WEB_ENV_AUTO_TEST=='1';
  console.log("--------------------------开始构建--------------------------");

  // console.log(process.argv );

  console.log('process.env.NODE_ENV-',process.env.NODE_ENV);



  //模块化 打包目标环境代码 定向 指定环境
  if(MODULE_SDK_VERSION){
    if(MODULE_SDK_VERSION.includes('shiwan')){  current_env ="idc_sandbox"}
    if(MODULE_SDK_VERSION.includes('online')){  current_env ="idc_online"}

  }
  // 当前环境代码内内置 写入的兜底 oss
  current_env_build_in_oss= compute_build_in_oss_by_current_env(current_env)

  console.log("当前环境代码内内置 写入的兜底 oss 如下： ");
  console.log( 'current_env_build_in_oss-----',current_env_build_in_oss);

// 亚洲 欧洲

  let  TARGET_VERSION_NAME='ouzhou'

  // 配置项目
  // 项目名称
  let TARGET_PROJECT_NAME = "yabo";
   // 项目版本
  // 专业版--zhuanye
  let DEFAULT_VERSION_NAME =  "zhuanye";
  // 企业信息
  let COM_CONFIG = process.env.FRONT_WEB_COM_CONFIG || 'com1';
  // 是否自动设置域名相关的地址
  let AUTO_API = process.env.AUTO_API || false;
  // 埋点Google Analytics GA_TRACKING_ID
  let GA_TRACKING_ID = 'G-3SFG732R1J' // 生产环境


  console.log(`配置项目名称:${TARGET_PROJECT_NAME}`);
  console.log(`项目版本:${DEFAULT_VERSION_NAME}`);

  // 最终项目配置信息
  let final_config = null;
  const ProConfig = require("./zenv/" + TARGET_PROJECT_NAME + ".js");
  const ComConfig = require("./zenv/com/com.js");

  final_config = ProConfig.initSet(current_env, DEFAULT_VERSION_NAME);
  const html_info = ComConfig.get(COM_CONFIG);
  Object.assign(html_info, {versionName:DEFAULT_VERSION_NAME})

  // 模板类型
  const TEMPLATE_NAME = final_config.pro_arr.TEMPLATE_NAME;
  // 项目名称
  const FINAL_TARGET_PROJECT_NAME = final_config.pro_arr.FINAL_TARGET_PROJECT_NAME;
  // 前端控制是否禁用收藏功能
  const ENABLE_COLLECT_API = true;



  let hidApi = (current_env=='idc_online')?'https://www.googletagmanager.com/gtag/js?id='+GA_TRACKING_ID:'';
  // 测试环境时使用
  if(current_env=='local_test'){
  // // 隔离环境时使用
  // if(current_env=='idc_lspre'){
    GA_TRACKING_ID = 'G-H3XWBEMYYL'
    hidApi = 'https://www.googletagmanager.com/gtag/js?id='+GA_TRACKING_ID
  }


  // 合并 所有内容
  Object.assign(final_config, {
    TEMPLATE_NAME,
    FINAL_TARGET_PROJECT_NAME: FINAL_TARGET_PROJECT_NAME,
    TARGET_PROJECT_NAME: TARGET_PROJECT_NAME,
    ENABLE_COLLECT_API: ENABLE_COLLECT_API,
    DEFAULT_VERSION_NAME: final_config.pro_arr.DEFAULT_VERSION_NAME,
    LOG,
    DOM_ID_SHOW,
    FRONT_WEB_ENV: process.env.FRONT_WEB_ENV,
    API_DOMAIN_PREFIX: "api",

    html_info:html_info,
    AUTO_API,
    TAG: process.env.TAG?process.env.TAG:'',
    // 埋点Google Analytics GA_TRACKING_ID
    GA_TRACKING_ID,
    BUILD_VERSION,
    MODULE_SDK_VERSION,
    hidApi,
    project_path:`project-${TARGET_VERSION_NAME}`,
    TARGET_VERSION_NAME,
  });




  let     htmlVariables= {
    title: `${html_info.title}`,
    icon: `${html_info.icon}`,
    productName: `${html_info.productName}`,
    productDescription: `${html_info.productDescription}`,
    version: `${html_info.version}`,
    versionName: `${html_info.versionName}`,
    versionDate: `${new Date().toLocaleString()}`,
    BRANCH: process.env.BRANCH,
    TAG: process.env.TAG,
    BUILD_TAG: process.env.BUILD_TAG  ,
    // 增加埋点api配置
    hidApi: final_config.hidApi,
    // 当前环境
    current_env,
    BUILD_VERSION:final_config.BUILD_VERSION ? '/'+final_config.BUILD_VERSION :"",
    error_upload_url: 'https://information-api.sportxxxwo8.com/error_info', // 错误上报环境地址
    // 企业信息
    com: `${html_info.com}`,
    max_width: `${html_info.max_width}`,
    body_bg_day: `${html_info.body_bg_day}`,
    body_bg_night: `${html_info.body_bg_night}`,
    day_logo: `${html_info.day_logo}`,
    night_logo: `${html_info.night_logo}`,
    compatible_logo: `${html_info.compatible_logo}`,
    default_theme: `${html_info.default_theme}`,
    prodect_env: process.env.NODE_ENV,
    current_env_build_in_oss:   encodeURIComponent(JSON.stringify(current_env_build_in_oss))  ,


  }


  final_config.htmlVariables =htmlVariables


  return final_config

  }





 module.exports= compute_final_config


// export default compute_final_config


