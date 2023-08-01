/**
 * 输出最终的 环境配置 ，用于验证 ,也用于初始化生成
 */

import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
import { compute_build_in_config } from "./build-in-config.js";
import { write_env_file } from "./write-env-file.js";
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

//  个人   开发环境
// current_env= 'local_local'
// 局域网  开发环境
// current_env= 'local_dev'
// 局域网  压力测试环境
// current_env = "local_ylcs";
// 局域网  测试环境
// current_env = "local_test";
// IDC  预发布
// current_env = 'idc_pre'
// IDC 试玩环境
// current_env = "idc_sandbox";
// IDC  隔离预发布
// current_env = 'idc_lspre'
// IDC  生产环境
// current_env = 'idc_online'
// IDC 微型测试环境
// current_env = 'idc_ylcs'

let all_env_arr = [
  "local_local",
  "local_dev",
  "local_test",
  "idc_lspre",
  "idc_pre",
  "idc_sandbox",
  "idc_ylcs",
  "idc_online",
];

// 输出目录
let write_folder = "./job/output/env/module";

let final_file_path = `./job/output/env/final.js`;
export const export_env_config = (env = "idc_online") => {
  //确保配置 输出目录存在
  ensure_write_folder_exist(write_folder);
  let final_env_arr = [];
  if (env == "all") {
    final_env_arr = [...all_env_arr];
  } else {
    final_env_arr = [env];
  }

  final_env_arr.map((x) => {
    console.log("final_env_arr---------x", x);
    let full_path = `${write_folder}/${x}.js`;

    let final_config = compute_build_in_config(x);

    let { htmlVariables = {} } = final_config;

    // 写入文件
    write_env_file(htmlVariables);
    let str = `export default  ` + JSON.stringify(final_config);
    write_file(full_path, str);
    if (!all_env) {
      write_file(final_file_path, str);
    }
  });
};

if (all_env) {
  export_env_config("all");
  remove_file(final_file_path);
} else {
  if (all_env_arr.includes(argv_version)) {
    export_env_config(argv_version);
  }
}
