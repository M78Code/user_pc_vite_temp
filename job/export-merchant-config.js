/**
 * 合并输出商户配置
 */
import axios from "axios";
import { merge_merchant_config } from "./merge-merchant-config.js";
import { ensure_write_folder_exist, write_file } from "./write-folder-file.js";
import { DEV_TARGET_VERSION,DEV_PROJECT_NAME } from "../dev-target-env.js";
console.log("export-merchant-config----------合并输出商户配置-");
 


 
 

// jenkins env 变量  配置的   构建 zip 版本参数   , 一般是运维那边 配置打包使用的    模块化打包  构建 zip 版本参数
 
const MODULE_SDK_VERSION = (process.env.SHIWAN_MODULE_SDK_VERSION || "").trim();

//最终计算的 版本号 
let final_version= MODULE_SDK_VERSION || DEV_TARGET_VERSION  


//分割字符串先 第一个项目  版本号 时间戳 环境 1全量/2差量
const [PROJECT, MERCHANT_CONFIG_VERSION, TIMESTAMP ] = final_version.split("-");


 //数字对应的项目
const PROJECT_MAP = {
  1: "-", //亚洲版 H5（旧版）
  2: "-", //亚洲版 PC（旧版）
  3: "yazhou-h5", //亚洲版 H5（新版)
  4: "yazhou-pc", //亚洲版 PC（新版)
};


//提取项目名称对应是数字
const   PROJECT_NUM  = PROJECT.split("-")[1];




/**
 * 重新计算  PROJECT_NAME  当    DEV_TARGET_VERSION   构建 zip
 * 本地指定 打包指定版本  计算  本地指定项目
 */
const  compute_PROJECT_NAME_when_DEV_TARGET_VERSION = () => {
 
let project_name= DEV_PROJECT_NAME
// 本地指定 打包指定版本  重置 本地指定项目
if(DEV_TARGET_VERSION){
  if (DEV_TARGET_VERSION.includes("project_3")) {
    project_name = "yazhou-h5";
  
  }else if (DEV_TARGET_VERSION.includes("project_4")) {
    project_name = "yazhou-pc";
  }
}

return project_name
};

 

//  最终项目布局模板名字
let PROJECT_NAME =    MODULE_SDK_VERSION?  PROJECT_MAP[PROJECT_NUM] : compute_PROJECT_NAME_when_DEV_TARGET_VERSION()

//时间格式化 计算 配置文件在服务器上的所在日期目录
function get_date_format() {
  const _date = new Date(Number(TIMESTAMP));
  const _y = _date.getFullYear();
  const _m = _date.getMonth() + 1;
  const _d = _date.getDate();
  return `${_y}${_m > 9 ? _m : "0" + _m}${_d}`;
}
//服务器端 配置文件 路径 
//暂时取全量-1.json  差量的 -2.json
// const SERVER_CONFIG_FILE_PATH = `http://api-doc-server-new.sportxxxw1box.com/public/upload/json/20230903/project_4-36304ea0499e11ee8848ada2b8a1d739-1693720827442-shiwan-1.json`;
const SERVER_CONFIG_FILE_PATH = `http://api-doc-server-new.sportxxxw1box.com/public/upload/json/${get_date_format()}/${final_version}-1.json`;
// console.log(get_date_format(),'get_date_formatget_date_format');
// console.log(final_version,'final_versionfinal_version');
// console.log(SERVER_CONFIG_FILE_PATH,'SERVER_CONFIG_FILE_PATH');


 
 
 


//商户配置的详细信息
let MERCHANT_CONFIG_INFO = {};
// 商户配置 输出目录
let write_folder = "./job/output/merchant";
let file_path = `${write_folder}/config.json`;
 

//确保配置 输出目录存在
ensure_write_folder_exist(write_folder);
/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const merge_and_output_final_config = (scg) => {
  let add_obj = {
    MERCHANT_CONFIG_VERSION,
    project: PROJECT_NAME,
    write_file_date: Date.now(),
  };
  MERCHANT_CONFIG_INFO = merge_merchant_config(scg, add_obj);
  write_file(file_path, JSON.stringify(MERCHANT_CONFIG_INFO));
};
/**
 * 获取 服务器上 当前商户的 版本配置
 */
const get_config_info = async () => {
  // API 对外文档 的 单个 版本的详情 获取地址
  try {
    console.log(SERVER_CONFIG_FILE_PATH)
    let res = await axios.get(SERVER_CONFIG_FILE_PATH);
    let { data } = res;
    if (data) {
      
      merge_and_output_final_config(data);
    }
  } catch (error) {
    console.log("获取 服务器上 当前商户的 版本配置 出错");
  }
};
if (MODULE_SDK_VERSION) {
    // 获取 服务器上 当前商户的 版本配置
    get_config_info();

} else {
  merge_and_output_final_config({});
}
