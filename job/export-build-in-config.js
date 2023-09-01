/**
 * 输出最终的 环境配置 ，用于验证 ,也用于初始化生成
 */
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
import { compute_build_in_config } from "./build-in-config-fn.js";
import { write_env_file } from "./write-env-file.js";
import {  DEV_TARGET_VERSION ,DEV_TARGET_ENV } from "../dev-target-env.js";


// --------------------------------
// 所有  目标环境标识
const ALL_ENV_ARR = [
  "local_local",
  "local_dev",
  "local_test",
  "idc_lspre",
  "idc_pre",
  "idc_sandbox",
  "idc_ylcs",
  "idc_online",
];

console.log("----process.argv---", process.argv);
// 输出所有环境
let all_env = false;
//命令行参数 配置的
let argv_version = (process.argv[2] || "").trim();
//最终计算出的 用于执行脚本的
if (argv_version) {
  if (argv_version == "all") {
    all_env = true;
  }
}
// 商户版本 最终配置
import final_merchant_config from "./output/merchant/config.json" assert { type: "json" };
// 商户版本号
const { MERCHANT_CONFIG_VERSION } = final_merchant_config;
// 常规随环境的   jenkins  部署  参数
const FRONT_WEB_ENV = (process.env.FRONT_WEB_ENV || "").trim();
// 模块化打包  构建 zip 版本参数
const MODULE_SDK_VERSION = (process.env.SHIWAN_MODULE_SDK_VERSION || "").trim();

/**
 * 重新计算  current_env 当   模块化打包  构建 zip
 */
const recompute_current_env_when_MODULE_SDK_VERSION = () => {
  let current_env = "";
  //模块化 打包目标环境代码 定向 指定环境
  console.log(
    "当前 已指定 试玩环境SDK打包 专用版本号 ， MODULE_SDK_VERSION : " +
      MODULE_SDK_VERSION
  );
  if (MODULE_SDK_VERSION.includes("shiwan")) {
    current_env = "idc_sandbox";
  }
  if (MODULE_SDK_VERSION.includes("online")) {
    current_env = "idc_online";
  }
  console.log(
    "当前 已指定 试玩环境SDK打包 专用版本号 ， 重定向打包输出的目标环境 :" +
      current_env
  );
  return current_env;
};
/**
 * 重新计算  current_env  当   常规随环境的   jenkins  部署
 */
const recompute_current_env_when_FRONT_WEB_ENV = () => {
  let current_env = "";
  //模块化 打包目标环境代码 定向 指定环境
  console.log(`当前环境已设置 FRONT_WEB_ENV ：  ${FRONT_WEB_ENV}`);
  console.log(
    "process.env.FRONT_WEB_ENV：    " +
      (process.env.FRONT_WEB_ENV || "当前环境未设置 FRONT_WEB_ENV")
  );
  current_env = FRONT_WEB_ENV;
  return current_env;
};




/**
 * 重新计算  current_env  当    DEV_TARGET_VERSION   构建 zip
 * 本地指定 打包指定版本  重置 本地指定环境
 */
const recompute_current_env_when_DEV_TARGET_VERSION = () => {
 
  let current_env = DEV_TARGET_ENV;
  //模块化 打包目标环境代码 定向 指定环境
  console.log(
    "当前 已指定 试玩环境SDK打包 专用版本号 ， DEV_TARGET_VERSION : " +
    DEV_TARGET_VERSION
  );
  if (DEV_TARGET_VERSION.includes("shiwan")) {
    current_env = "idc_sandbox";
  }
  if (DEV_TARGET_VERSION.includes("online")) {
    current_env = "idc_online";
  }
  console.log(
    "当前 已指定 试玩环境SDK打包 专用版本号 ， 重定向打包输出的目标环境 :" +
      current_env
  );
  return current_env;

};





// 输出目录
let write_folder = "./job/output/env/module";
let final_file_path = `./job/output/env/final.js`;
const export_env_config = (env) => {
  if (!env) {
    console.error("当前未指定目标构建环境 ：  必须指定 ！ 修复后再试！");
    return false;
  }
  //确保配置 输出目录存在
  ensure_write_folder_exist(write_folder);
  let final_env_arr = [];
  if (env == "all") {
    final_env_arr = [...ALL_ENV_ARR];
    console.log(
      `当前最终计算结果：构建目标环境 ：  所有环境 ，将不会生成  final 文件 ，现有final 文件已自动删除`
    );
  } else {
    final_env_arr = [env];
    console.log(`当前最终计算结果：构建目标环境 ： ${env}`);
  }
  final_env_arr.map((x) => {
    console.log("final_env_arr---------x", x);
    let full_path = `${write_folder}/${x}.js`;
    // 计算至如的  配置
    let final_config = compute_build_in_config(x);
    let { htmlVariables = {} } = final_config;
    // 写入文件
    write_env_file(htmlVariables);
    let str = `export default   window.BUILDIN_CONFIG=` + JSON.stringify(final_config);

    write_file(full_path, str);
    if (!all_env) {
      write_file(
        final_file_path,
        `export default window.BUILDIN_CONFIG= ` + JSON.stringify(final_config)
      );
    }
  });
};



console.log(
  "输出 环境相关的最终植入配置 脚本执行，脚本名字 ： export-build-in-config  "
);
console.log(`将自动删除 final 配置文件,  文件路径 :${final_file_path}`);
remove_file(final_file_path);

// 根据当前 相关参数  执行 计算
if (all_env) {
  export_env_config("all");
} else {
  // 命令行参数
  if (ALL_ENV_ARR.includes(argv_version)) {
    export_env_config(argv_version);
  } else if (MODULE_SDK_VERSION) {
    //模块化打包  构建 zip
    let current_env = recompute_current_env_when_MODULE_SDK_VERSION();
    export_env_config(current_env);
  } else if (FRONT_WEB_ENV) {
    //jenkins 参数
    let current_env = recompute_current_env_when_FRONT_WEB_ENV();
    export_env_config(current_env);
  } else {
    let current_env = recompute_current_env_when_DEV_TARGET_VERSION()  ;
    //  开发人员本地开发
    export_env_config(current_env);
  }
}
