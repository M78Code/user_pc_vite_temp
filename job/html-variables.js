// 商户版本 最终配置
 

import {import_json_data} from "./util.js"
let   final_merchant_config  ={}
//活动等其他单独项目打包不存在这个
try {
  final_merchant_config  = await import_json_data( "./output/merchant/config.json")
} catch (error) {
  console.log('活动等其他单独项目打包不存在这个' );
}
 
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
const { BUILD_VERSION, PROJECT_NAME ,MODULE_SDK_VERSION ,LAYOUT_META} = BUILD_VERSION_CONFIG;


let server_html_info = final_merchant_config.html_info  ||{}
let default_html_info = {
  // 网站标题
  title: {
    // zh: "亚洲在线体育竞猜投注",
    // en: "Asian Online Gaming Platform",
    // tw: "亞洲在線體育競猜投注",
  },
  // 网站icon
  icon: "",
  // 产品名称
  productName: "",
  // 产品描述
  productDescription: "",
  // 企业代号
  com: "com1",
  // 名称
  nameEn: "",
  // 名称
  name: "",
  // 最大宽度
  max_width: 1350,
  // body背景颜色 日间版
  body_bg_day: "FFFFFF",
  // body背景颜色 夜间版
  body_bg_night: "191C24",
 
 
 
};




export  const  html_info = Object.assign({ },default_html_info,server_html_info )

export const   htmlVariables = {
        
    title: html_info.title ,
    icon: `${html_info.icon}`,
    productName: `${html_info.productName}`,
    productDescription: `${html_info.productDescription}`,
 
    versionDate: `${new Date().toLocaleString()}`,
    max_width: `${html_info.max_width}`,
    body_bg_day: `${html_info.body_bg_day}`,
    body_bg_night: `${html_info.body_bg_night}`,
 
    BRANCH: process.env.BRANCH,
    TAG: process.env.TAG,
    BUILD_TAG: process.env.BUILD_TAG  ,
    PROJECT_NAME,
    LAYOUT_META,
    BUILD_VERSION,
    MODULE_SDK_VERSION,

    error_upload_url: 'https://information-api.sportxxxwo8.com/error_info', // 错误上报环境地址

 


  }










