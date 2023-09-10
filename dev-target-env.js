/**
 * 此文件 仅仅用于本地开发 作为 环境指定 使用
 */
let DEV_TARGET_ENV = "local_test";
//  个人   开发环境
// DEV_TARGET_ENV= 'local_local'
// 局域网  开发环境
// DEV_TARGET_ENV= 'local_dev'
// 局域网  压力测试环境
// DEV_TARGET_ENV = "local_ylcs";
// 局域网  测试环境
DEV_TARGET_ENV = "local_test";
// IDC  预发布
// DEV_TARGET_ENV = 'idc_pre'
// IDC 试玩环境
// DEV_TARGET_ENV = "idc_sandbox";
// IDC  隔离预发布
// DEV_TARGET_ENV = 'idc_lspre'
// IDC  生产环境
// DEV_TARGET_ENV = 'idc_online'
// IDC 微型测试环境
// DEV_TARGET_ENV = 'idc_ylcs'






 
//本地开发 目标项目
// let DEV_PROJECT_NAME = "yazhou-pc";
let DEV_PROJECT_NAME = "yazhou-h5";




// 这里不一般配置为空 
let  DEV_TARGET_VERSION = ''
//代码内配置死的    构建 zip 版本参数    ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程 
// DEV_TARGET_VERSION ="project_4-36304ea0499e11ee8848ada2b8a1d739-1693720827442-shiwan";

// 打包 亚洲版 PC（新版)   试玩环境  
// DEV_TARGET_VERSION ="project_4-0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan";
// 打包 亚洲版 PC（新版)   生产环境
// DEV_TARGET_VERSION ="project_4-0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan";

// 打包 亚洲版 H5（新版)   试玩环境     
// DEV_TARGET_VERSION ="project_3-0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan";
// 打包 亚洲版 H5（新版)   生产环境    
// DEV_TARGET_VERSION ="project_3-0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan";







 


export {
  DEV_TARGET_ENV,
  DEV_PROJECT_NAME,
  DEV_TARGET_VERSION
 
 
};



