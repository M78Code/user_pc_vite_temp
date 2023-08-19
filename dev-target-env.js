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
DEV_TARGET_ENV = "idc_sandbox";
// IDC  隔离预发布
// DEV_TARGET_ENV = 'idc_lspre'
// IDC  生产环境
// DEV_TARGET_ENV = 'idc_online'
// IDC 微型测试环境
// DEV_TARGET_ENV = 'idc_ylcs'

//运维 打包对应 环境
const ENV_MAP = {
  online: "idc_online",
  shiwan: "idc_sandbox",
};

// --------------------------------
//测试参数 应该是从 process.argv 来的
const TEST_ARGV =
  "project_4-0b1d5ec0284611eea47c132df8d8e15d-1691927205605-shiwan";
//命令行参数 配置的   商户版本号    ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程
let argv_version = (process.argv[2] || "").trim();
//env 变量  配置的   商户版本号    , 一般是运维那边 配置打包使用的
let env_version = (process.env["MERCHANT-CONFIG-VERSION"] || "").trim();
//最终计算出的 用于执行脚本的  商户版本号
let ARGV = (env_version || argv_version || TEST_ARGV).trim();

//分割字符串先 第一个项目  版本号 时间戳 环境 1全量/2差量
const [PROJECT, MERCHANT_CONFIG_VERSION, TIMESTAMP, ENV] = ARGV.split("-");
console.log(process);

//获取命令行的 打包环境
if (ENV_MAP[ENV]) {
  DEV_TARGET_ENV = ENV_MAP[ENV];
}
//数字对应的项目
const project_map = {
  1: "-", //亚洲版 H5（旧版）
  2: "-", //亚洲版 PC（旧版）
  3: "yazhou-h5", //亚洲版 H5（新版)
  4: "yazhou-pc", //亚洲版 PC（新版)
};
//提取项目名称对应是数字
const [_, PROJECT_NUM] = PROJECT.split("_");
// 代码内 配置的   商户版本号 ，一般是  本地开发 或者  本地测试 打包指定版本用
let PROJECT_NAME = project_map[PROJECT_NUM];
//本地环境

// PROJECT_NAME = "yazhou-pc";
PROJECT_NAME = "yazhou-h5";

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
function get_date_format() {
  const _date = new Date(Number(TIMESTAMP));
  const _y = _date.getFullYear();
  const _m = _date.getMonth() + 1;
  const _d = _date.getDate();
  return `${_y}${_m > 9 ? _m : "0" + _m}${_d}`;
}
//暂时取全量-1.json  差量的 -2.json
const FILE_PATH = `https://api-doc-server-new.sportxxxw1box.com/public/upload/json/${get_date_format()}/${ARGV}-1.json`;
export {
  DEV_TARGET_ENV,
  ALL_ENV_ARR,
  MERCHANT_CONFIG_VERSION,
  TIMESTAMP,
  ENV,
  FILE_PATH,
  PROJECT_NAME,
  PROJECT_NUM,
};
