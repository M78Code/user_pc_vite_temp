/**
 * 创建 本次打包的 客户端版本
 */
import { ensure_write_folder_exist, write_file } from "./write-folder-file.js";
import { DEV_TARGET_VERSION } from "../dev-target-env.js";
const IS_DEV = ("" + process.argv[2]).trim() == "dev";
// jenkins env 变量  配置的   构建 zip 版本参数   , 一般是运维那边 配置打包使用的    模块化打包  构建 zip 版本参数
let ENV_MODULE_SDK_VERSION = (process.env.MODULE_SDK_VERSION || "").trim();
//最终计算的 版本号
let MODULE_SDK_VERSION = ENV_MODULE_SDK_VERSION || DEV_TARGET_VERSION;
//分割字符串先 第一个项目  版本号 时间戳 环境 1全量/2差量
const [PROJECT, MERCHANT_CONFIG_VERSION, PUCK_UP_TIME, ENVSTR] =
MODULE_SDK_VERSION.split("-");
//数字对应的项目
const PROJECT_MAP = {
  // project_1: "-", //亚洲版 H5（旧版）
  // project_2: "-", //亚洲版 PC（旧版）
  project_3: "yazhou-h5", //亚洲版 H5（新版)
  project_4: "yazhou-pc", //亚洲版 PC（新版)
  project_5: "app-h5", // 复刻版 H5 - KYAPP
  project_6: "new-pc", // 亚洲版 pc 202310 新平坦化版本
  project_7: "ouzhou-pc", // 欧洲版-PC 
  project_8: "ouzhou-h5", // 欧洲版-H5
};
//布局名字
const PROJECT_NAME = PROJECT_MAP[PROJECT];
//删除布局资源数组
const NEED_DELETE_PROJECT = Object.values(PROJECT_MAP).filter(x=>x!=PROJECT_NAME)


//参数内环境和代码内环境映射
const ENVSTR_MAP = {
  dev: "local_dev",
  test: "local_test",
  geli: "idc_lspre",
  mini: "idc_ylcs",
  shiwan: "idc_sandbox",
  online: "idc_online",
};

//当前环境
const CURRENT_ENV = ENVSTR_MAP[ENVSTR];
// oss
const OSS_FILE_MAP = {
  dev: "dev.json",
  test: "test.json",
  geli: "lspre.json",
  mini: "mini.json",
  shiwan: "play.json",
  online: "prod.json",
};

const OSS_FILE_NAME = OSS_FILE_MAP[ENVSTR]

function format_date(value) {
  let time = new Date(parseInt(value));
  let y = time.getFullYear();
  let m = (time.getMonth() + 1 + "").padStart(2, 0);
  let d = (time.getDate() + "").padStart(2, 0);
  let h = (time.getHours() + "").padStart(2, 0);
  let mm = (time.getMinutes() + "").padStart(2, 0);
  let s = (time.getSeconds() + "").padStart(2, 0);
  return `${y}-${m}-${d}-${h}-${mm}-${s}`;
}
const BUILD_VERSION = format_date(new Date().getTime());

 
const config = {
  BUILD_VERSION: IS_DEV ? "" : BUILD_VERSION,
  IS_DEV,
  IS_PROD: !IS_DEV,
  NODE_ENV: IS_DEV ? "development" : "production",
  MODULE_SDK_VERSION,
  CURRENT_ENV,
  PROJECT_NAME,
  NEED_DELETE_PROJECT,
  IS_PC: PROJECT_NAME.includes('pc'),
  PUCK_UP_TIME,
 
  OSS_FILE_NAME
 
};
// console.log(config);
let str = `export default  ${JSON.stringify(config)} `;
// 输出目录
let write_folder = "./job/output/version";
//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
let full_path = `${write_folder}/build-version.js`;
write_file(full_path, str);
