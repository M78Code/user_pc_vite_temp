/**
 * 复制OSS 到本地
 * 前端代码内 OSS 添加一个计算出来的路径
 *
 * 前端当前域名+/oss/+(dev|test|lspre|play|prod)+.json
 *
 */
//  console.log(process.argv);
import {
  ensure_write_folder_exist,
  write_file,
  remove_file,
} from "./write-folder-file.js";
import axios from "axios";

import { import_json_data } from "./util.js";

// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
const { BUILD_VERSION, CURRENT_ENV,BUILD_DIR_NAME } = BUILD_VERSION_CONFIG;
 
// 命令行参数
const argv_param = ("" + process.argv[2]).trim();
// is_dist  是 true 则 则 目录在 dist/spa 下生成oss 目录
const is_dist = argv_param == "dist";
const is_backup = argv_param == "backup";
const is_output = argv_param == "output";
if (is_dist) {
  remove_file(`./dist/${BUILD_DIR_NAME}/${BUILD_VERSION}/oss`);
}
// return  false
// OSS--开发---- https://api-json.sportxxx25o1bmw.com/dev.json
// OSS--测试---- https://api-json.sportxxx25o1bmw.com/test.json
// OSS--隔离---- https://api-json.sportxxx25o1bmw.com/lspre.json
// OSS--试玩预发布---- https://api-json.sportxxx25o1bmw.com/play.json
// OSS--生产---- https://xbnhjktbwggfvyok.ybgjhb.com/prod.json
// OSS--生产---- https://aukukktsxfauannt.zyakxf.com/prod.json
// OSS--生产---- https://xbnhjktbwggfvyok.chinazjyh.com/prod.json
// OSS--生产---- https://xbnhjktbwggfvyok.lcjzgt.com/prod.json
const ENV_OSS_OBJ = {
  local_local: ["https://api-json.sportxxx25o1bmw.com/dev.json"],
  local_dev: ["https://api-json.sportxxx25o1bmw.com/dev.json"],
  local_test: ["https://api-json.sportxxx25o1bmw.com/test.json"],
  local_ylcs: ["https://api-json.sportxxx25o1bmw.com/test.json"],
  idc_lspre: ["https://api-json.sportxxx25o1bmw.com/lspre.json"],
  idc_pre: ["https://api-json.sportxxx25o1bmw.com/play.json"],
  idc_sandbox: ["https://api-json.sportxxx25o1bmw.com/play.json"],
  idc_ylcs: ["https://api-json.sportxxx25o1bmw.com/mini.json"],
  idc_online: [
    "https://xbnhjktbwggfvyok.ybgjhb.com/prod.json",
    "https://aukukktsxfauannt.zyakxf.com/prod.json",
    "https://xbnhjktbwggfvyok.chinazjyh.com/prod.json",
    "https://xbnhjktbwggfvyok.lcjzgt.com/prod.json",
  ],
};
export const compute_oss_file_path_arr = (current_env) => {
  return ENV_OSS_OBJ[current_env] || [];
};
let oss_arr = [];
// 创建文件夹
let check_dir = "";
if (is_dist) {
  oss_arr = compute_oss_file_path_arr(CURRENT_ENV);
  check_dir = `./dist/${BUILD_DIR_NAME}/oss`;
}
if (is_backup) {
  for (let env in ENV_OSS_OBJ) {
    oss_arr = [...oss_arr, ...ENV_OSS_OBJ[env]];
  }
  check_dir = "./job/backup-oss";
}
// 输出到
if (is_output) {
  oss_arr = compute_oss_file_path_arr(CURRENT_ENV);
  // 创建文件夹
  check_dir = "./job/output/oss";
}
let zhixing_job = is_dist || is_backup || is_output;
const write_oss_fn = async () => {
  //计算文件名字
  function compute_file_name(str = "") {
    let arr = str.split("/");
    return arr[arr.length - 1].trim();
  }
  //确保  输出目录存在
  ensure_write_folder_exist(check_dir);
  let oss_data_obj = {};
  // 拉取服务器资源 写入本地
  for (let i = 0; i < oss_arr.length; i++) {
    let file_name = compute_file_name(oss_arr[i]);

    try {
      const res = await axios.get(oss_arr[i],{timeout:5000});

      if (res.data) {
        oss_data_obj[file_name] = res.data;
      } else {
        if (!oss_data_obj[file_name]) {
          oss_data_obj[file_name] = {};
        }
      }
    } catch (error) {
      if (!oss_data_obj[file_name]) {
        oss_data_obj[file_name] = {};
        //写入本地备份文件
        const env_back_up_data = await import_json_data(
          `./backup-oss/${file_name}`
        );
        oss_data_obj[file_name] = env_back_up_data;
      }
    }
  }

  const write_file_fn = (file_name, data) => {
    let full_path = `${check_dir}/${file_name}`;
    write_file(full_path, JSON.stringify(data));
  };
  setTimeout(function () {
    for (let key in oss_data_obj) {
      write_file_fn(key, oss_data_obj[key]);
    }
  }, 5000);
};
if (zhixing_job) {
  await write_oss_fn();
}
