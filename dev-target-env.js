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
// DEV_TARGET_ENV = "local_test";
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
// --------------------------------
// 所有  目标环境标识
let ALL_ENV_ARR = [
  "local_local",
  "local_dev",
  "local_test",
  "idc_lspre",
  "idc_pre",
  "idc_sandbox",
  "idc_ylcs",
  "idc_online",
];
export { DEV_TARGET_ENV, ALL_ENV_ARR };
