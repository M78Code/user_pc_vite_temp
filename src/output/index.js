/**
 * 业务逻辑  相关
 * 数据仓库
 * 通用项目：  各个版本 体育 客户端 H5,PC ,
 * 不通用项目：活动动画等其他 项目
 *
 * 所有的用法 都一样 注意 这里输出的 模块不能 用这种方法
 * import { xxxx } from "src/output/index.js";
 * import { is_eports_csid  } from "src/output/index.js";
 *
 */

 
 
 
//所有项目通用： 业务逻辑  无关  ： 常量，工具函数 ，国际化 ，顶层通信用的 全局常量和 MITT
export * from "./constant-utils.js";
 
//所有项目通用： 业务逻辑 无关  ： 用户类，接口请求 ，埋点
export * from "./global-common.js";
//体育客户端通用： 非数据仓库的其他业务逻辑
export * from "./project-computed.js";

//体育客户端通用：  数据仓库
export * from "./match-data-base.js";
 