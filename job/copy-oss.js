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
const { BUILD_VERSION, CURRENT_ENV,BUILD_DIR_NAME ,BUILD_OUTDIR,IS_TOPIC_PROJECT } = BUILD_VERSION_CONFIG;
 

// return  false
// OSS--开发---- https://api-json.dbsportxxx3pk.com/dev.json
// OSS--测试---- https://api-json.dbsportxxx3pk.com/test.json
// OSS--隔离---- https://api-json.dbsportxxx3pk.com/lspre.json
// OSS--试玩预发布---- https://api-json.dbsportxxx3pk.com/play.json
// OSS--生产---- https://xbnhjktbwggfvyok.ybgjhb.com/prod.json
// OSS--生产---- https://aukukktsxfauannt.zyakxf.com/prod.json
// OSS--生产---- https://xbnhjktbwggfvyok.chinazjyh.com/prod.json
// OSS--生产---- https://xbnhjktbwggfvyok.lcjzgt.com/prod.json
const ENV_OSS_OBJ = {
  local_local: ["https://api-json.dbsportxxx3pk.com/dev.json"],
  local_dev: ["https://api-json.dbsportxxx3pk.com/dev.json"],
  local_test: ["https://api-json.dbsportxxx3pk.com/test.json"],
  local_ylcs: ["https://api-json.dbsportxxx3pk.com/test.json"],
  idc_lspre: ["https://api-json.dbsportxxx3pk.com/lspre.json"],
  idc_pre: ["https://api-json.dbsportxxx3pk.com/play.json"],
  idc_sandbox: ["https://api-json.dbsportxxx3pk.com/play.json"],
  idc_ylcs: ["https://api-json.dbsportxxx3pk.com/mini.json"],
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


// 命令行参数
const argv_param = ("" + process.argv[2]).trim();
//生产打包构建 ：  目标是最终打包生成到  `./dist/${BUILD_DIR_NAME}/oss`  ，用于最终的生产构建
const is_dist = argv_param == "dist";
//本地备份OSS文件： 目标是备份 所有OSS 文件到本地 ，用于备份
const is_backup = argv_param == "backup";  
//生成脚本用OSS文件：目标是输出到  ./job/output 目录下 用于 内部脚本流程
const is_output = argv_param == "output";

 

// 当前环境的 远程服务端 OSS 路径数组 
let server_oss_url_arr = [];
// oss 文件生成的 目标路径
let local_oss_target_dir = "";
//生产打包构建 
if (is_dist) {
  //生产构建 删除 构建生成目录下的的OSS 目录，也就是打包的时候从public/oss内拷贝过来的
  remove_file(`./${BUILD_OUTDIR}/oss`);
  server_oss_url_arr = compute_oss_file_path_arr(CURRENT_ENV);

  if(IS_TOPIC_PROJECT){ 

 
  local_oss_target_dir = `./dist/oss`;

  }else{
 

  local_oss_target_dir = `./dist/${BUILD_DIR_NAME}/oss`;
  }
}
//本地备份OSS文件 
if (is_backup) {
  for (let env in ENV_OSS_OBJ) {
    server_oss_url_arr = [...server_oss_url_arr, ...ENV_OSS_OBJ[env]];
  }
  local_oss_target_dir = "./job/backup-oss";
}
//生成脚本用OSS文件
if (is_output) {
  server_oss_url_arr = compute_oss_file_path_arr(CURRENT_ENV);
  // 创建文件夹
  local_oss_target_dir = "./job/output/oss";
}
let zhixing_job = is_dist || is_backup || is_output;
console.log(`复制oss--is_dist--${is_dist}--is_backup--${is_backup}--is_output--${is_output}--`);
const write_oss_fn = async () => {
  //计算文件名字
  function compute_file_name(str = "") {
    let arr = str.split("/");
    return arr[arr.length - 1].trim();
  }
  //确保  输出目录存在
  ensure_write_folder_exist(local_oss_target_dir);
  let oss_data_obj = {};
  // 拉取服务器资源 写入本地
  for (let i = 0; i < server_oss_url_arr.length; i++) {
    let file_name = compute_file_name(server_oss_url_arr[i]);

    try {
      const res = await axios.get(server_oss_url_arr[i],{timeout:5000});

      if (res.data) {
        oss_data_obj[file_name] = res.data;
        console.log(`复制oss---${file_name}--接口正常--正常`);
      } else {
        console.log(`复制oss---${file_name}--接口正常--为空`);
        if (!oss_data_obj[file_name]) {
          oss_data_obj[file_name] = {};
          console.log(`复制oss---${file_name}--接口正常--为空--赋值为空`);
        }else{
          console.log(`复制oss---${file_name}--接口正常--为空--已有缓存值`);
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
        console.log(`复制oss---${file_name}--接口错误----没有缓存值---读取备份文件进行赋值`);
      }else{
        console.log(`复制oss---${file_name}--接口错误----已有缓存值`);
      }
    }
  }

  const write_file_fn = (file_name, data) => {
    let full_path = `${local_oss_target_dir}/${file_name}`;
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
