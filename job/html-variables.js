// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
 




let server_html_info = final_merchant_config.html_info  ||{}
let default_html_info = {
  // 网站标题
  title: {
    zh: "亚洲在线体育竞猜投注",
    en: "Asian Online Gaming Platform",
    tw: "亞洲在線體育競猜投注",
  },
  // 网站icon
  icon: "",
  // 产品名称
  productName: "亚洲在线体育竞猜投注",
  // 产品描述
  productDescription: "亚洲在线体育竞猜投注",
  // 产品版本
  version: "0.0.1",
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
  // 主logo日间
  day_logo: "",
  // 主logo夜间
  night_logo: "",
  // 浏览器兼容页logo
  compatible_logo: "",
 
 
};




export  const  html_info = Object.assign({ },default_html_info,server_html_info )

export const   htmlVariables = {
        
    title: html_info.title ,
    icon: `${html_info.icon}`,
    productName: `${html_info.productName}`,
    productDescription: `${html_info.productDescription}`,
    version: `${html_info.version}`,
    versionName: `${html_info.versionName}`,
    versionDate: `${new Date().toLocaleString()}`,
    max_width: `${html_info.max_width}`,
    body_bg_day: `${html_info.body_bg_day}`,
    body_bg_night: `${html_info.body_bg_night}`,
    day_logo: `${html_info.day_logo}`,
    night_logo: `${html_info.night_logo}`,
    compatible_logo: `${html_info.compatible_logo}`,
    default_theme: `${html_info.default_theme}`,




    BRANCH: process.env.BRANCH,
    TAG: process.env.TAG,
    BUILD_TAG: process.env.BUILD_TAG  ,
    NODE_ENV: process.env.NODE_ENV,

    error_upload_url: 'https://information-api.sportxxxwo8.com/error_info', // 错误上报环境地址

 


  }










