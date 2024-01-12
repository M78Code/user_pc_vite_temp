/**
 * 此文件 仅仅用于本地开发 作为 环境指定 使用
 */
 
// 运维自动化 读取地址
// https://assets-image.oceasfe.com/public/upload/yunwei/need_packup.json

 
//本地开发 目标项目
 

// 这里不一般配置为空 
let  DEV_TARGET_VERSION = ''
//代码内配置死的    构建 zip 版本参数    ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程 
//----------------------------------2021亚洲版-H5  yazhou-h5 3-------------------------------------------
// 测试环境
// DEV_TARGET_VERSION = "project_3-652cce36feffd80f0fcda0f0-1698407516978-test";
// 试玩环境     
// DEV_TARGET_VERSION = "project_3-652cce36feffd80f0fcda0f0-1697888720318-shiwan";
// 生产环境    
// DEV_TARGET_VERSION = "project_3-652cce36feffd80f0fcda0f0-1697965003241-online";

//----------------------------------2021亚洲版-PC  	yazhou-pc -4------------------------------------------
// 测试环境  
// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1700379923616-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1697770590787-shiwan";
// 生产环境
// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1700379404859-online"

// DEV_TARGET_VERSION = "project_4-652ccfacfeffd80f0fcda107-1697972059806-online"


//----------------------------------2023亚洲版-H5-KYAPP  app-h5  5 -------------------------------------------
// 测试环境  
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1704444689091-test";     
// 试玩环境  
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1704444720039-shiwan";
// 隔离环境  
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1704444703687-geli";
// 生产环境
// DEV_TARGET_VERSION = "project_5-652e267f1ca49737811219ef-1704444664353-online";

//----------------------------------2023亚洲版-PC   new-pc 6-------------------------------------------
// 测试环境
// DEV_TARGET_VERSION = "project_6-652e26e71ca4973781121a07-1705041028362-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_6-652e26e71ca4973781121a07-1705041578408-shiwan";
// 生产环境
// DEV_TARGET_VERSION = "project_6-652e26e71ca4973781121a07-1705041518195-online";




//----------------------------------2023欧洲版-PC  ouzhou-pc 7-------------------------------------------
// 测试环境
// DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1700645253734-test";
   
// 隔离环境
// DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1700984307856-geli";

// 试玩环境
// DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1702114645027-shiwan";
// 生产环境
DEV_TARGET_VERSION = "project_7-6544b0f3fb906b00ad5e8733-1702176206745-online";

//----------------------------------2023欧洲版-H5  ouzhou-h5 8-------------------------------------------
// 测试环境  
// DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1703043330510-test";
// 试玩环境  
// DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1702359106395-shiwan";
// 隔离环境  
// DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1700716624534-geli";
// 生产环境
// DEV_TARGET_VERSION = "project_8-6544b116720143009a2f282d-1703043542072-online";




















// 其他项目 非客户端H5 PC 项目 专用的  
let DEV_TARGET_ENV=''
//开发
DEV_TARGET_ENV='dev'
//测试
DEV_TARGET_ENV='test'
//隔离
DEV_TARGET_ENV='geli'
// //压测
// DEV_TARGET_ENV='mini'
// //试玩
// DEV_TARGET_ENV='shiwan'
// //生产
DEV_TARGET_ENV='online'



//是否是用于内部测试  是：true ，否：false

let DEV_IS_FOR_NEIBU_TEST= true


//  DEV_IS_FOR_NEIBU_TEST= false
export {
 
 
  DEV_TARGET_VERSION,
  DEV_TARGET_ENV,
  DEV_IS_FOR_NEIBU_TEST
 
 
};
