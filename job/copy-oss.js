/**
 * 复制OSS 到本地
 * 前端代码内 OSS 添加一个计算出来的路径
 *
 * 前端当前域名+/oss/+(dev|test|lspre|play|prod)+.json
 *
 */
//  console.log(process.argv);
 
import { ensure_write_folder_exist,  write_file, remove_file } from "./write-folder-file.js";
import axios from "axios";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "./output/version/build-version.js";
 const  { BUILD_VERSION , CURRENT_ENV } = BUILD_VERSION_CONFIG;
// 本次打包的 目录
import BUILD_DIR_CONFIG from "./output/dir/index.js";
let BUILD_DIR_NAME = BUILD_DIR_CONFIG.BUILD_DIR_NAME;
// is_dist  是 true 则 则 目录在 dist/spa 下生成oss 目录
const is_dist = ("" + process.argv[2]).trim() == "dist";
if (is_dist) {

  remove_file(`./dist/${BUILD_DIR_NAME}/${BUILD_VERSION}/oss`)
 
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


  const ENV_OSS_OBJ={
  "local_local":["https://api-json.sportxxx25o1bmw.com/dev.json"],
  "local_dev":[ "https://api-json.sportxxx25o1bmw.com/dev.json"],
  "local_test":[  "https://api-json.sportxxx25o1bmw.com/test.json"],
  "local_ylcs":[  "https://api-json.sportxxx25o1bmw.com/test.json"],
  "idc_lspre":[ "https://api-json.sportxxx25o1bmw.com/lspre.json"],
  "idc_pre":[ "https://api-json.sportxxx25o1bmw.com/play.json"],
  "idc_sandbox":[ "https://api-json.sportxxx25o1bmw.com/play.json"],
  "idc_ylcs":[
    "https://api-json.sportxxx25o1bmw.com/mini.json"
  ],
  "idc_online":[
    "https://xbnhjktbwggfvyok.ybgjhb.com/prod.json",
    "https://aukukktsxfauannt.zyakxf.com/prod.json",
    "https://xbnhjktbwggfvyok.chinazjyh.com/prod.json",
    "https://xbnhjktbwggfvyok.lcjzgt.com/prod.json"
  ],
}


export const  compute_oss_file_path_arr=(current_env)=>{

  return ENV_OSS_OBJ[current_env] ||[]

}

let oss_arr = [
];


for(let i in ENV_OSS_OBJ){

  oss_arr=[
    ...oss_arr,
    ...ENV_OSS_OBJ[i]
  ]

}




let file_key_arr = [];
oss_arr.map((str1) => {
  let name = str1.substring(str1.lastIndexOf("/") + 1, str1.lastIndexOf("."));
  file_key_arr.push(name);
});
file_key_arr = Array.from(new Set(file_key_arr));
//计算文件名字
function compute_file_name(str = "") {
  let arr = str.split("/");
  return arr[arr.length - 1].trim();
}
// 创建文件夹
let check_dir = is_dist ? `./dist/${BUILD_DIR_NAME}/oss` : "./job/output/oss";
//确保  输出目录存在
ensure_write_folder_exist(check_dir);
let oss_data_obj = {};
// 拉取服务器资源 写入本地
for (let i = 0; i < oss_arr.length; i++) {
  let file_name = compute_file_name(oss_arr[i]);
  axios
    .get(oss_arr[i])
    .then((res) => {
      if (res.data) {
        oss_data_obj[file_name] = res.data;
      } else {
        if (!oss_data_obj[file_name]) {
          oss_data_obj[file_name] = {};
        }
      }
    })
    .catch(function (error) {
      console.error(error);
      if (!oss_data_obj[file_name]) {
        oss_data_obj[file_name] = {};
      }
    });
}
const write_file_fn = (file_name, data) => {
  let full_path = `${check_dir}/${file_name}`;
 
  write_file(full_path, JSON.stringify(data))

 
};
setTimeout(function () {
  for (let key in oss_data_obj) {
    write_file_fn(key, oss_data_obj[key]);
  }
}, 5000);
