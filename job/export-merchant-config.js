/**
 * 合并输出商户配置
 */
import * as fs from "node:fs";
import axios from "axios";
import { merge_merchant_config } from "./merge-merchant-config.js";
console.log("export-merchant-config----------合并输出商户配置-");
console.log("process.argv----------------------0---");
console.log(process.argv);
console.log("process.argv----------------------1---");
console.log(
  "MERCHANT-CONFIG-VERSION  :  ",
  process.env["MERCHANT-CONFIG-VERSION"]
);
// console.log('MERCHANT-CONFIG-VERSION  2:  ', process.env);
console.log("process.argv----------------------3---");
// 代码内 配置的   商户版本号       ，一般是  本地测试 打包指定版本用
let demo_version = "123456";
//命令行参数 配置的   商户版本号    ，一般是 本地测试 打包指定版本用 ，也可以支持 打包流程
let argv_version = ( process.argv[2] || "" ).trim();
//env 变量  配置的   商户版本号    , 一般是运维那边 配置打包使用的
let env_version = (process.env["MERCHANT-CONFIG-VERSION"] || "").trim();
//最终计算出的 用于执行脚本的  商户版本号
let MERCHANT_CONFIG_VERSION = env_version || argv_version || demo_version;
//商户配置的详细信息
let MERCHANT_CONFIG_INFO = {};
// 商户配置 输出目录
let write_folder = "./job/output/merchant";
// let file_path = `${write_folder}/v_${MERCHANT_CONFIG_VERSION}.json`;
let file_path = `${write_folder}/config.json`;
//开启 ，关闭本地测试  ,这个 上线必须设置false
let ENABLE_TEST = true;
/**
 * 确保配置 输出目录存在
 */
const ensure_write_folder_exist = () => {
let is_exist = fs.existsSync(write_folder)
    if (is_exist) {
        console.log( `${write_folder}-----文件夹已存在----  ` );  
    }else{
          // 创建文件夹
      fs.mkdir(write_folder, { recursive: true }, (err) => {
        if (err) {
          console.log("创建文件夹 出错 ", err);
        }
        console.log("创建文件夹   完成");
      });
    }
};
//确保配置 输出目录存在
ensure_write_folder_exist();
/**
 * 计算并写入 最终配置到文件 ，这里可能需要合并一些默认配置或者一些配置重写覆盖
 */
const merge_and_output_final_config = (scg) => {

    let  add_obj={
        MERCHANT_CONFIG_VERSION,
        project:'ouzhou',
        write_file_date: Date.now()
    }
  MERCHANT_CONFIG_INFO = merge_merchant_config(scg,add_obj);
  fs.writeFile(
    file_path,
    JSON.stringify(MERCHANT_CONFIG_INFO),
    "utf8",
    (err) => {
      if (err) {
        console.log("MERCHANT_CONFIG_INFO 写入出错", err);
      }else{
        console.log("MERCHANT_CONFIG_INFO 写入 完成");
      }
    
    }
  );
 


};
/**
 * 获取 服务器上 当前商户的 版本配置
 */
const get_config_info = async () => {
  // API 对外文档 的 单个 版本的详情 获取地址
  let url =
    "http://api-doc-server-new.sportxxxw1box.com/client/xxxxx/info?version=" +
    MERCHANT_CONFIG_VERSION;
  try {
    let res = await axios.get(url);
    console.log(res);
    let { data } = res;
    if (data) {
      merge_and_output_final_config(data);
    }
  } catch (error) {
    console.log("获取 服务器上 当前商户的 版本配置 出错");
  }
};
if (ENABLE_TEST) {
  merge_and_output_final_config({});
} else {
  // 获取 服务器上 当前商户的 版本配置
  get_config_info();
}
