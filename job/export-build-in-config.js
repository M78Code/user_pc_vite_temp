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
import { ALL_ENV_ARR } from "./config.js";
 
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
// --------------------------------
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
// 输出目录
let write_folder = "./job/output/env/module";
let final_file_path = `./job/output/env/index.js`;
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
    let str =
      `export default   ` + JSON.stringify(final_config);
    write_file(full_path, str);
    if (!all_env) {
      write_file(
        final_file_path,
        `export default   ` + JSON.stringify(final_config)
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
  } else {
    //模块化打包  构建 zip
    let current_env = BUILD_VERSION_CONFIG.CURRENT_ENV;
    export_env_config(current_env);
  }
}
