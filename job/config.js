

import lodash from "lodash";

//html 入口配置 
 
 import html_config_activity_config from  "./template-html/modules/activity.js"
 import html_config_app_h5_config from  "./template-html/modules/app-h5.js"
 import html_config_ouzhou_h5_config from  "./template-html/modules/ouzhou-h5.js"
 import html_config_ouzhou_pc_config from  "./template-html/modules/ouzhou-pc.js"
 import html_config_animation_page_config from  "./template-html/modules/animation-page.js"
 import html_config_default_config from  "./template-html/modules/default.js"
 

 




// --------------------------------
// 所有  目标环境标识
export const ALL_ENV_ARR = [
    "local_local",
    "local_dev",
    "local_test",
    "idc_lspre",
    "idc_pre",
    "idc_sandbox",
    "idc_ylcs",
    "idc_online",
  ];
  


  // 项目  入口配置   
  export const PROJECT_ENTRY_CONFIG = {
    project_1: {
     value:  "project_1",
     layout_meta:"2021-YZ-H5",
     description:"2021亚洲版 H5（旧版）",
     html_config: html_config_default_config,
     output_base:"default",
     output_project:"default-h5",
     api_index:"default"
    }, 
    project_2: {
      value:  "project_2",
      layout_meta:"2021-YZ-PC",
      description:"2021亚洲版 PC（旧版）",
      html_config: html_config_default_config,
      output_base:"default",
      output_project:"default-pc",
      api_index:"default"
     },     
     project_3: {
      value:  "yazhou-h5",
      layout_meta:"2021-YZ-H5",
      main_project:1,
      description:"2021亚洲-H5 重构版本  亚洲版 H5（新版)  ",
      html_config: html_config_default_config,
      output_base:"default",
      output_project:"yazhou-h5",
      api_index:"default"
     },        
     project_4: {
      value:  "yazhou-pc",
      layout_meta:"2021-YZ-H5",
      main_project:1,
      description:"2021亚洲-PC 重构版本  亚洲版 PC（新版)  ",
      html_config: html_config_default_config,
      output_base:"default",
      output_project:"yazhou-pc",
      api_index:"default"
     },   
     project_5: {
      value:  "app-h5",
      layout_meta:"2023-YZ-H5",
      main_project:1,
      description:"2023亚洲-H5  复刻版 H5  - KYAPP ",
      html_config: html_config_app_h5_config,
      output_base:"default",
      output_project:"yazhou-pc",
      api_index:"default"
     },   
     project_6: {
      value:  "new-pc",
      layout_meta:"2023-YZ-PC",
      main_project:1,
      description:"2023亚洲-PC     ",
      html_config: html_config_default_config,
      output_base:"default",
      output_project:"new-pc",
      api_index:"default"
     },   
     project_7: {
      value:  "ouzhou-pc",
      layout_meta:"2023-OZ-PC",
      main_project:1,
      description:"2023欧洲-PC   ",
      html_config: html_config_ouzhou_pc_config,
      output_base:"default",
      output_project:"ouzhou-pc",
      api_index:"default"
     },   
     project_8: {
      value:  "ouzhou-h5",
      layout_meta:"2023-OZ-H5",
      main_project:1,
      description:"2023欧洲-H5  ",
      html_config: html_config_ouzhou_h5_config,
      output_base:"default",
      output_project:"ouzhou-h5",
      api_index:"default"
     },   
   
     activity: {
      value:  "activity",
      layout_meta:"ACTIVITY-01",
      description:"topic 主题项目 ：活动 任务中心    ",
      html_config: html_config_activity_config,
      output_base:"",
      output_project:"",
      api_index:"default"
     },   
     animation: {
      value:  "animation",
      layout_meta:"ANIMATION-01",
      description:"自研动画   ",
      output_base:"",
      output_project:"",
      api_index:"default"
     },  
     'animation-page': {
      value:  "animation-page",
      layout_meta:"ANIMATION-02",
      description:"L01动画   ",
      html_config: html_config_animation_page_config,
      output_base:"",
      output_project:"",
      api_index:"default"
     },   
   
  
     
     "client-sdk-dev": {
      value:  "client-sdk",
      layout_meta:"CLIENT-SDK-DEV",
      description:"SDK 本地开发调试  ",
      html_config: html_config_default_config,
      output_base:"",
      output_project:"",
      api_index:"default"
     },   
     "client-sdk-build": {
      value:  "client-sdk",
      layout_meta:"CLIENT-SDK-PROD",
      description:"SDK 打包  ",
      html_config: html_config_default_config,
      output_base:"",
      output_project:"",
      api_index:"default"
     },   
     "template-project": {
      value:  "template-project",
      layout_meta:"TEMPLATE-PROJECT",
      description:"客户端单体小项目的 通用模板 ",
      html_config: html_config_default_config,
      output_base:"",
      output_project:"",
      api_index:"default"
     },   
   
   
   
    
   
   
  };
  