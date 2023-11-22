/**
 * 此文件 仅仅用于本地开发 作为 环境指定 使用
 */
 
// 运维自动化 读取地址
// https://assets-image.oceasfe.com/public/upload/yunwei/need_packup.json

 
//本地开发 目标项目
 

// 这里不一般配置为空 
let  DEV_TARGET_VERSION = ''
//代码内配置死的    构建 zip 版本参数    ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程 
//----------------------------------	亚洲版-H5-重构版本 yazhou-h5 3-------------------------------------------
// 测试环境
// DEV_TARGET_VERSION = "project_3-652cce36feffd80f0fcda0f0-1698407516978-test";
// 试玩环境     
// DEV_TARGET_VERSION = "project_3-652cce36feffd80f0fcda0f0-1697888720318-shiwan";
// 生产环境    
// DEV_TARGET_VERSION = "project_3-652cce36feffd80f0fcda0f0-1697965003241-online";

//----------------------------------亚洲版-PC-重构版本 	yazhou-pc -4------------------------------------------
// 测试环境  
// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1700379923616-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1697770590787-shiwan";
// 生产环境
// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1700379404859-online"

// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1697972059806-online"


//----------------------------------分割线  复刻版-H5-KYAPP  app-h5  5 -------------------------------------------
// 测试环境  
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1699793036147-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1699510585384-shiwan";
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1699178741277-geli";
// 生产环境
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1699154069801-online";

//----------------------------------亚洲版-PC-202310新平坦化版本  new-pc 6-------------------------------------------
// 测试环境
// DEV_TARGET_VERSION = "project_6-65269e44299a92ef78372a54-1697298222546-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_6-65269e44299a92ef78372a54-1697083289058-shiwan";
// 生产环境
// DEV_TARGET_VERSION = "project_6-65269e44299a92ef78372a54-1697298236508-online";




//----------------------------------欧洲版-PC  ouzhou-pc 7-------------------------------------------
// 测试环境
DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1700534100371-test";
   
// 试玩环境
// DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1700549017378-shiwan";

// 生产环境
// DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1700470476268-online";

//----------------------------------欧洲版-H5  ouzhou-h5 8-------------------------------------------
// 测试环境  
// DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1700488684133-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1700306375010-shiwan";
// 生产环境
DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1700470476243-online";




















// 其他项目 非客户端H5 PC 项目 专用的  
let DEV_TARGET_ENV=''
//开发
DEV_TARGET_ENV='dev'
//测试
DEV_TARGET_ENV='test'
//隔离
DEV_TARGET_ENV='geli'
//压测
DEV_TARGET_ENV='mini'
//试玩
DEV_TARGET_ENV='shiwan'
//生产
DEV_TARGET_ENV='online'



export {
 
 
  DEV_TARGET_VERSION,
  DEV_TARGET_ENV
 
 
};
