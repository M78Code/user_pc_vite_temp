/***
 *
 * 业务逻辑  无关 项目有一定关系 
 * 常量，工具函数 ，国际化 ，顶层通信用的 全局常量和 MITT
 * 通用项目： 各个版本 体育 客户端 H5,PC ,  
 * 不通用项目： 活动动画等其他 项目
 *
 * 必须 内部 单独引用 或者  从 src\output\module\constant-utils.js  引用 问题不大
 * 但是不能 引用 非这个文件内引入的内容
 */

export * from  "src/output/module/constant-utils-common.js"
export * from  "src/output/module/global-common.js"