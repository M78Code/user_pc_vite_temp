/**
 * 合并输出商户配置
 */
import axios from "axios";
import colors from "colors"
import { merge_merchant_config } from "./merge-merchant-config.js";
import {  write_file } from "../util-and-config/write-folder-file.js";
// 本次打包的 客户端版本
import BUILD_VERSION_CONFIG from "../output/version/build-version.js";
console.log(colors.bgRed("export-merchant-config----------合并输出商户配置-"));


//时间格式化 计算 配置文件在服务器上的所在日期目录
function get_date_format() {
  const _date = new Date(Number(BUILD_VERSION_CONFIG.PUCK_UP_TIME));
  const _y = _date.getFullYear();
  const _m = _date.getMonth() + 1;
  const _d = _date.getDate();
  return `${_y}${_m > 9 ? _m : "0" + _m}${_d > 9 ? _d : "0" + _d}`;
}
//服务器端 配置文件 路径 
//暂时取全量-1.json  差量的 -2.json
/**
 * https://assets-image.sportxxxw1box.com  jenkins 内网打包专用
 * https://assets-image.oceasfe.com  静态资源CDN
 * https://api-doc-server-new.sportxxxw1box.com 对外文档API 域名
 */


//因为加白问题 ，打包构建和 本地开发拉取资源使用不同域名
let SERVER_CONFIG_FILE_PATH =  `https://assets-image.sportxxxw1box.com/public/upload/json/${get_date_format()}/${BUILD_VERSION_CONFIG.MODULE_SDK_VERSION}-1.json`;
// const SERVER_CONFIG_FILE_PATH = `https://assets-image.oceasfe.com/public/upload/json/20230903/project_4-36304ea0499e11ee8848ada2b8a1d739-1693720827442-shiwan-1.json`;
// const SERVER_CONFIG_FILE_PATH = `https://assets-image.oceasfe.com/public/upload/json/${get_date_format()}/${BUILD_VERSION_CONFIG.MODULE_SDK_VERSION}-1.json`;

if(BUILD_VERSION_CONFIG.IS_DEV){
  SERVER_CONFIG_FILE_PATH = `https://assets-image.oceasfe.com/public/upload/json/${get_date_format()}/${BUILD_VERSION_CONFIG.MODULE_SDK_VERSION}-1.json`;
}
  
 
 
console.log(SERVER_CONFIG_FILE_PATH, 'SERVER_CONFIG_FILE_PATH');







//商户配置的详细信息
let MERCHANT_CONFIG_INFO = {};
// 商户配置 输出目录
let write_folder = "./job/output/merchant";
let base_info_write_folder = "./job/output/base-info";
let file_path = `${write_folder}/config.json`;
 
 
/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const merge_and_output_final_config =  async (scg) => {
  let add_obj = {
   
    project: BUILD_VERSION_CONFIG.PROJECT_NAME,
    IS_PC:  BUILD_VERSION_CONFIG.IS_PC,
    write_file_date: Date.now(),
  };
  MERCHANT_CONFIG_INFO = merge_merchant_config(scg, add_obj);

  write_file(file_path, JSON.stringify(MERCHANT_CONFIG_INFO));

  // // 写入本地对应的商户配置
  //  write_file(local_file_path, JSON.stringify(MERCHANT_CONFIG_INFO));

 
  const BASE_INFO={
    pack_up_info:MERCHANT_CONFIG_INFO.pack_up_info,
    ...add_obj
  }

   write_file( `${base_info_write_folder}/index.json`, JSON.stringify(BASE_INFO));
};
/**
 * 获取 服务器上 当前商户的 版本配置
 */
const get_config_info = async () => {
  // API 对外文档 的 单个 版本的详情 获取地址
  try {
    let res = await axios.get(SERVER_CONFIG_FILE_PATH,{timeout:30000});
    let { data } = res;
    if (data) {
      await  merge_and_output_final_config(data);
    }
  } catch (error) {
    console.log("获取 服务器上 当前商户的 版本配置 出错");
  }
};
// 暂时都获取服务器上 当前商户的 版本配置 写入本地
// get_config_info();
 
  // 获取 服务器上 当前商户的 版本配置
  get_config_info();

 